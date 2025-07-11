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
import { mail } from '../controllers/Mailsend.js';
const router = express.Router();

router.post('/register', register);  
router.post('/login', login);
router.get('/logout', logout);
router.get('/fetch-advisor',fetchAdvisors)
router.get('/advisor/:id',details)
router.post('/complainForm',complainForm)
router.post('/followrequest',followRequest) 
router.post('/zoom',zoomService)
router.post('/sendmail',mail)

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


export default router;
