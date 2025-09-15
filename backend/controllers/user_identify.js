import bcrypt from "bcryptjs";
import fs from 'fs';
import { fileURLToPath } from "url";
import path from "path";
import { User } from "../models/user_module.js";
import { Advisor } from "../models/advisor_details.js";
import { Manager } from "../models/manager_details.js";
import jwt from 'jsonwebtoken';
import { Complain } from "../models/complain_details.js";
import { PaymentRecords } from "../models/payments_records.js";
import { ChatRoom } from "../models/chatroom.js";
import { error } from "console";
import axios from 'axios';
import twilio from "twilio";
// import client  from "twilio/lib/base/BaseTwilio.js";
import client from 'twilio'

const handleResponse = (res,status,message,success,info = null) => {
    return res.status(status).json({success,message,success,info});
}

export const register = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password ||!phone) {
            handleResponse(res,400,"All fields are required",false);
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            handleResponse(res,400,"User already exists with this email",false);
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Generate profile photo URL
        const data = {
            name: name,
        };
        const url = 'https://gender-detection-m29y.onrender.com/predict';
        const urlEncodedData = new URLSearchParams(data);
        const response = await axios.post(url, urlEncodedData);
        let genderValue = null;
        if(response.data.gender_prediction =='m'){
            genderValue="Male"
        }else{
            genderValue="Female"
        }
        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            gender: genderValue,
            phone,
        });
        handleResponse(res,201,"Account created successfully",true);
    } catch (error) {
        console.log("Registration Error:", error);
        next(error)
    }
};
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            handleResponse(res,400,"All fields are required",false);
        }

        const user = await User.findOne({ email });
        const manager = await Manager.findOne({ email });
        const advisor = await Advisor.findOne({ email });

        // Advisor login with default password
        if (advisor && email === advisor.email && password === "manager0000") {
            handleResponse(res,200,"Login Successfully Advisor",false,advisor);
        }
        // Admin login
        if (email === "admin@gmail.com" && password === "admin") {
            handleResponse(res,200,"Login Successfully Admin",true);
        }
        if (email === "priya.sharma@gmail.com" && password === "manager01") {
            handleResponse(res,200,"Login Successfully Manager",true);
        }
        if (!user && !manager) {
            handleResponse(res,400,"Enter valid email or password",false);
        }

        const isPasswordMatch = user
            ? await bcrypt.compare(password, user.password)
            : await bcrypt.compare(password, manager.password);

        if (!isPasswordMatch) {
            handleResponse(res,401,"Incorrect email or password",false);
        }

        const tokenData = {
            userId: user ? user._id : manager._id
        };

        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict'
        }).json({
            message: user ? "Login Successfully User" : "Login Successfully Manager",
            info: user || manager,
            success: true
        });
    } catch (error) {
        next(error);
    }
};
export const logout = async (req, res) => {
    try {
        res.status(200).cookie('token', '', { maxAge: 0 }).json({
            message: "Logout Successfully"
        });
    }
    catch (error) {
        console.log(error)
    }
}
export const fetchAdvisors = async (req, res, next) => {
    try {
        const advisors = await Advisor.find({ permission: 'allow' }); 
        handleResponse(res,201,"Fetched Advisor",true,advisors);
    } catch (error) {
        next(error)
    }
};
export const details = async (req, res,next) => {
    const { id } = req.params;
  try {
    const advisor = await Advisor.findById(id);
    if (!advisor) {
        handleResponse(res,404,"Advisor not found",false);
    }
    handleResponse(res,200,"Advisor found",true,advisor); 
  } catch (err) {
    next(err)
  }
};
export const fetchManager = async (req, res,next) => {
    try {
        const managers = await Manager.find({});
        handleResponse(res,200,"Advisor found",true,managers);
    } catch (error) {
        console.error('Error fetching advisors:', error);
        next(error);
    }
};
export const managerinfo = async (req, res,next) => {
    try {
        const manager = await Manager.findById(req.params.id);
        if (!manager) return res.status(404).json({ message: 'Manager not found' });
        // return res.status(200).json(manager);
        handleResponse(res,200,"Manager not found",true,manager);
    } catch (error) {
        next(error);
    }
};
export const fecthinactive = async (req, res,next) => {
    try {
        const advisors = await Advisor.find({ status: 'inactive' });
        // return res.status(200).json({ success: true, data: advisors });
        handleResponse(res,200,"Fetched inactive advisors",true,advisors);
    } catch (error) {
        console.error('Error fetching advisors:', error);
        // return res.status(500).json({ success: false, message: 'Server Error' });
        next(error);
    }
}
export const fecthactive = async (req, res,next) => {
    try {
        const advisors = await Advisor.find({ status: 'active' });
        // return res.status(200).json({ success: true, data: advisors });
        handleResponse(res,200,"Fetched active advisors",true,advisors);
    } catch (error) {
        console.error('Error fetching advisors:', error);
        // return res.status(500).json({ success: false, message: 'Server Error' });
        next(error);
    }
}
export const disapproveList = async (req, res,next) => {
    try {
        const advisors = await Advisor.find({ permission: 'notallow' });
        // return res.status(200).json({ success: true, info: advisors });
        handleResponse(res,200,"Fetched disapproved advisors",true,advisors);
    } catch (error) {
        // return res.status(500).json({ success: false, message: 'Server Error' });
        next(error);
    }
}
export const complaintype = async (req, res,next) => {
    try {
        const role = req.params.name;
        console.log(role);
        const complain = await Complain.find({ role: req.params.name, status: 'Unsolved' });
        // return res.status(200).json({ success: true, data: complain });
        handleResponse(res,200,"Fetched advisors complain",true,complain);
    } catch (error) {
        console.error('Error fetching advisors complain:', error);
        // return res.status(500).json({ success: false, message: 'Server Error' });
        next(error);
    }
}
export const complain = async (req, res,next) => {
    try {
        const { feedback, name, index } = req.body;
        const complain = await Complain.findById(index);
        complain.status = 'Solved';
        complain.feedback = feedback;
        await complain.save();
        //return res.status(200).json({ sucess: true, message: 'Delete sucessfully' })
        handleResponse(res,200,"Delete sucessfully",true);
    } catch (error) {
        //return res.status(500).json({ success: false, message: 'Server Error' });
        next(error);
    }
}
export const complainall = async (req, res,next) => {
    try {
        const complainall = await Complain.find({ role: req.params.name });
        // return res.status(200).json({ status: true, data: complainall });
        handleResponse(res,200,"Fetched all complain",true,complainall);
    } catch (err) {
        // return res.status(500).json({ status: false, message: 'Server Error' });
        next(err);
    }
}
export const complainForm = async (req, res,next) => {
    try {
        const { sender, subject, description, role } = req.body;
        const complain = await Complain.create({
            sender,
            subject,
            description,
            role
        })
        await complain.save();
        // return res.status(200).json({ status: true, message: 'Successfull' });
        handleResponse(res,200,"Successfull",true);
    } catch (error) {
        //return res.status(500).json({ status: false, message: 'Server Error' });
        next(error);
    }
}
export const schedule = async (req, res,next) => {
    const { advisorId, schedule } = req.body;
  try {
    // Validate inputs
    if (!advisorId || typeof schedule !== 'object') {
      //return res.status(400).json({ msg: 'Invalid advisorId or schedule data' });
      handleResponse(res,400,"Invalid advisorId or schedule data",false);
    }

    const advisor = await Advisor.findById(advisorId);
    if (!advisor) return res.status(404).json({ msg: 'Advisor not found' });

    // Filter out blocked slots from the new schedule
    for (const day of Object.keys(schedule)) {
      const validTimes = schedule[day].filter(time => {
        return !advisor.tempBlockedSlots.some(
          slot => slot.day === day && slot.time === time
        );
      });

      advisor.schedule[day] = validTimes;
    }

    await advisor.save();
    //res.status(200).json({ msg: 'Schedule updated successfully', schedule: advisor.schedule });
    handleResponse(res,200,"Schedule updated successfully",true,advisor.schedule);
  } catch (err) {
    console.error(err);
    //res.status(500).json({ msg: 'Server error', error: err.message });
    next(err);
  }
}
export const followRequest = async (req, res,next) => {
    try {
        const user = req.body.user;
        const id = req.body.id;
        console.log(user, id);
        const followed = await User.findById(user);
        if (!followed) {
            //return res.status(404).json({ status: false, message: 'User not found' });
            handleResponse(res,404,"User not found",false);
        }

        // Check if already following
        if (followed.follows.includes(id)) {
            // Unfollow
            followed.follows = followed.follows.filter(item => item !== id);
            await followed.save();
            //return res.status(200).json({ status: true, message: 'unfollowed', info: followed });
            handleResponse(res,200,"unfollowed",true,followed);
        } else {
            // Follow
            followed.follows.push(id);
            await followed.save();
            //return res.status(200).json({ status: true, message: 'followed', info: followed });
            handleResponse(res,200,"followed",true,followed);
        }

    } catch (error) {
        //console.error("Follow Request Error:", error);
        //return res.status(500).json({ status: false, message: 'Server error' });
        next(error);
    }
};
export const approveAdvisor = async (req, res,next) => {
    try {
        const advisor = await Advisor.findById(req.params.id);
        if (!advisor) {
            //return res.status(500).json({ status: true, message: 'Advisor not found' });
            handleResponse(res,404,"Advisor not found",false);
        } else {
            advisor.permission = 'allow';
            await advisor.save();
            //return res.status(200).json({ status: true, message: 'Advisor created successfully' });
            handleResponse(res,200,"Advisor created successfully",true);
        }
    }
    catch (error) {
        //return res.status(500).json({ status: false, message: 'Server error' });
        next(error);
    }
}
export const disapproveAdvisor = async (req, res,next) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const uploadDir = path.join(__dirname, '..', 'files');
        const advisor = await Advisor.findById(req.params.id);

        // Check the folder exists or not
        const files = fs.readdirSync(uploadDir);
        //     
        files.map((img, index) => {
            if (advisor.images.includes(img)) {
                const __imagename = path.join(uploadDir, img)
                fs.unlinkSync(__imagename);
            }
        })

        const deleted = await Advisor.findByIdAndDelete(req.params.id);

        if (!deleted) {
            //return res.status(404).json({ status: false, message: 'Advisor not found' });
            handleResponse(res,404,"Advisor not found",false);
        }

        //return res.status(200).json({ status: true, message: 'Advisor deleted successfully' });
        handleResponse(res,200,"Advisor deleted successfully",true);
    } catch (error) {
        console.error('Disapproval error:', error);
        //return res.status(500).json({ status: false, message: 'Server error' });
        next(error);
    }
};
export const clientbill = async (req, res, next) => {
    const { id, date, time, clientId, transactionId, price, method } = req.body;
    try {
        // Find the advisor to validate the time slot
        const advisor = await Advisor.findById(id);
        if (!advisor) {
            handleResponse(res, 400, 'Advisor not found', false);
        }

        const normalizedDay = date.toLowerCase();

        // Check for time slot availability
        if (!advisor.schedule[normalizedDay] || !advisor.schedule[normalizedDay].includes(time)) {
            handleResponse(res, 400, `Time slot not available on ${normalizedDay}`, false);
        }

        // --- All checks passed, perform atomic updates ---

        // Record payment
        await PaymentRecords.create({
            transactionId,
            amount: price,
            senderId: clientId,
            recieverId: id,
            payment_method: method,
            day: normalizedDay,
            time
        });

        // Create chat room
        const room = await ChatRoom.findOne({ clientId, advisorId: id });
        if (!room) {
            await ChatRoom.create({ clientId, advisorId: id, createdAt: new Date() });
        }

        // Atomically update both the advisor and user documents in a single operation
        // This is crucial for data integrity. 
        const advisorUpdateResult = await Advisor.findByIdAndUpdate(
            id,
            {
                // Atomically remove the time slot from the schedule and add it to tempBlockedSlots
                $pull: { [`schedule.${normalizedDay}`]: time },
                $push: { tempBlockedSlots: { day: normalizedDay, time } },
                // Use the $inc operator to atomically increment the client count
                $inc: { client: 1 }
            },
            { new: true, runValidators: true } // Return the updated document and run validators
        );
        
        // This is another way to update, if you prefer to use the document instance
        // advisor.client++;
        // await advisor.save();
        // The first method is generally better as it's a single, atomic operation.

        await User.findByIdAndUpdate(clientId, { $inc: { totalmet: 1 } });

        if (!advisorUpdateResult) {
            // This case would be rare but is good practice to handle
            handleResponse(res, 500, 'Failed to update advisor document', false);
        }

        handleResponse(res, 200, "Slot booked", true);

    } catch (err) {
        console.error('❌ Client bill error:', err.message);
        // It's good practice to send an error response in the catch block
        next(err);
    }
};
export const bookdschedule = async (req, res,next) => {
  const id = req.query.id;  

  try {
    const advisor = await Advisor.findById(id);
    if (!advisor) {
      //return res.status(404).json({ status: false, msg: 'Advisor not found' });
      handleResponse(res,404,"Advisor not found",false);
    }

    return res.status(200).json({
      status: true,
      info: advisor.tempBlockedSlots || [],
    });

  } catch (err) {
    //console.error(err);
    //return res.status(500).json({ status: false, error: err.message });
    next(err);
  }
};
export const transactionManager = async (req, res,next) => {
    try {
        const data = await PaymentRecords.find({});
        //return res.status(200).json({ data, message: "Data fetched successfully" });
        handleResponse(res,200,"Data fetched successfully",true,data);
    } catch (err) {
        //return res.status(500).json({ message: "Failed to fetch data", error: err.message || err });
        next(err);
    }
};
export const forgotPassword = async (req,res,next) => {
    try {
        const otp = Math.floor(10000 + Math.random() * 90000);
        const { email } = req.body;
        const user = User.findOne({ email: email });
        const phone = user?.phone;
        const client = twilio(process.env.ACCOUNTSID,process.env.AUTHTOKEN);
        client.messages.create({
            body: `Your OTP for FarmAdvise is: ${otp}`,
            from: '+18563220803',
            to: `+91${phone}`
        })
        .then(message => console.log(message.sid))
        .catch(err => console.error('Error sending SMS:', err));
        handleResponse(res,200,"OTP sent successfully",true,otp);
    }
    catch (error) {
        next(error);
    }
}
export const gender = async(req, res, next) => {
    try {
        const { name } = req.params;
        const data = {
            name: name,
        };
        const url = 'https://gender-detection-m29y.onrender.com/predict';
        const urlEncodedData = new URLSearchParams(data);
        const response = await axios.post(url, urlEncodedData);
        handleResponse(res, 200, "Gender detected", true,  response.data);
  } catch (error) {
    next(error);
  }
}
export const changePassword = async(req,res,next) =>{
    try{
        const {newPassword,id} = req.body;
        const updatedUser = await User.findByIdAndUpdate(
        id, 
            { password: newPassword },
            { new: true, runValidators: true } // Options
        );
        if(!updatedUser){
            handleResponse(res, 500, 'Failed to update new Password', false);
        }
        handleResponse(res, 200, 'Update Password', true);
    }catch(error){
        next(error);
    }
}
