import express from 'express';
import { complainForm, details, fetchAdvisors, followRequest, login, logout, register, } from '../controllers/user_identify.js';
import multer from 'multer';
import crypto from "crypto"
import path from 'path'
import { Advisor } from "../models/advisor_details.js";
import Razorpay from 'razorpay';
import { fileURLToPath } from 'url';
import cors from 'cors'
import bodyParser from "body-parser";
import fs from 'fs';
import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils.js';
import { zoomService } from '../controllers/zoomPath.js';
const router = express.Router();

router.post('/register', register);  
router.post('/login', login);
router.get('/logout', logout);
router.get('/fetch-advisor',fetchAdvisors)
router.get('/advisor/:id',details)
router.post('/complainForm',complainForm)
router.post('/followrequest',followRequest)
router.post('/zoom',zoomService)

//------------------multer------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '..', 'files');

// Create the folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Safe, flexible location
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, function (err, bytes) {
      if (err) return cb(err);
      const uniqueName = bytes.toString("hex") + path.extname(file.originalname);
      cb(null, uniqueName);
    });
  }
});

const upload = multer({ storage });

router.post('/verify', upload.array('images', 5), async (req, res) => {
  console.log(req.files); // Multiple files

  const { fullname, email, phone, qualification, linkedIn, experience, bio } = req.body;
  console.log(fullname, email, phone, qualification, linkedIn, experience, bio);

  // Validate fields
  if (!fullname || !email || !phone || !qualification || !linkedIn || !experience || !bio) {
    return res.status(400).json({
      message: "All fields are required",
      success: false
    });
  }

  // Validate file upload
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      message: "At least one certificate file is required",
      success: false
    });
  }

  // Check for duplicate advisor
  const existingUser = await Advisor.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      message: "User already exists with this email",
      success: false
    });
  }

  // Get all uploaded file names
  const imageFilenames = req.files.map(file => file.filename);

  // Save advisor
  const newAdvisor = await Advisor.create({
    fullname,
    email,
    phone,
    qualification,
    linkedIn,
    experience,
    bio,
    images: imageFilenames,
  });

  return res.status(201).json({
    message: "Account created successfully. It will take time to be approved by the organization.",
    success: true
  });
});

//------------------payment-----------------------------

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: 'rzp_test_Y2wy8t1wD1AFaA',
  key_secret: 'zSqRMpIa2ljBBpkieFYGmfLa',
});

// Helpers to manage orders.json
const ordersFile = path.resolve('orders.json');

const readData = () => {
  if (fs.existsSync(ordersFile)) {
    const data = fs.readFileSync(ordersFile);
    return JSON.parse(data);
  }
  return [];
};

const writeData = (data) => {
  fs.writeFileSync(ordersFile, JSON.stringify(data, null, 2));
};

// Initialize orders.json if it doesn't exist
if (!fs.existsSync(ordersFile)) {
  writeData([]);
}

// === Create Order ===
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    console.log("amount : ",{amount});

    const options = {
      amount: amount, // ₹500.00 in paise
      currency: 'INR',
      receipt: "receipt_order_" + Date.now(),
      notes: {
        user: 'test user'
      },
    };

    const order = await razorpay.orders.create(options);

    const orders = readData();
    orders.push({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: 'created',
    });
    writeData(orders);

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating order');
  }
});

// === Verify Payment ===
router.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const secret = razorpay.key_secret;
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  try {
    const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);

    if (isValidSignature) {
      const orders = readData();
      const order = orders.find(o => o.order_id === razorpay_order_id);
      if (order) {
        order.status = 'paid';
        order.payment_id = razorpay_payment_id;
        writeData(orders);
      }
      res.status(200).json({ status: 'ok' });
      console.log("Payment verification successful");
    } else {
      res.status(400).json({ status: 'verification_failed' });
      console.log("Payment verification failed");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error verifying payment' });
  }
});

// === Payment Success Page (optional) ===
router.get('/payment-success', (req, res) => {
  res.redirect('http://localhost:5173/success'); // frontend route
});


export default router;
