import express from 'express'
import multer from 'multer'
//import fs from 'fs'
import crypto from "crypto"
import path from 'path'
import  {Manager} from '../models/manager_details.js'
import { complainall, fetchManager, managerinfo } from '../controllers/user_identify.js';

const router = express.Router();

//------------------multer------------------------------
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../backend/managerfiles");
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function (err, bytes) {
            const fn = bytes.toString("hex") + path.extname(file.originalname)
            cb(null, fn)
        })
    }
});

const upload = multer({ storage: storage });

router.post('/create-manager', upload.single('image'), async (req, res) => {
    console.log(req.file);

    const { fullname, email, phone, qualification, linkedIn, experience, bio } = req.body;
    console.log(fullname, email, phone, qualification, linkedIn, experience, bio);

    // Validate all fields and at least one file
    if (!fullname || !email || !phone || !qualification || !linkedIn || !experience || !bio) {
         return res.status(400).json({ message: "All fields and at least one profile photo is require", success: false });
        //console.log("All fields and at least one certificate file are required")
    }

    // Check if advisor already exists
    const existingUser = await Manager.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email", success: false });
        //console.log("User already exists with this email");
    }

    //     Save to DB
    const newManager = await Manager.create({
        fullname,
        email,
        phone,
        qualification,
        linkedIn,
        experience,
        bio,
        images: req.file.filename
    });
    await newManager.save();
    return res.status(201).json({
        message: "Account created successfully. It will take time to be display in database.",
        success: true
    });
    //console.log("Account created successfully. It will take time to be approved by the organization.")
});
//-------------------------------------------------------
router.post('/fetch-manager',fetchManager)
router.post('/managerinfo/:id',managerinfo)
router.post('/complainall/:name',complainall)


export default router;