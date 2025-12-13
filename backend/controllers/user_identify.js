import RedisClient from "../cache.js";
import mongoose from "mongoose";
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
import axios from 'axios';
import twilio from "twilio";

const handleResponse = (res,status,message,success,info = null) => {
    return res.status(status).json({message,success,info});
}
export const register = async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction(); 
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            await session.abortTransaction(); 
            return handleResponse(res, 400, "All fields are required", false);
        }

        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            await session.abortTransaction();
            return handleResponse(res, 201, "User already exists with this email", false);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const data = { name };
        const url = 'https://gender-detection-m29y.onrender.com/predict';
        const urlEncodedData = new URLSearchParams(data);
        const response = await axios.post(url, urlEncodedData);  

        let genderValue = response.data.gender_prediction === 'm' ? "Male" : "Female";

        await User.create(
            {
                name,
                email,
                password: hashedPassword,
                gender: genderValue,
                phone,
            }
        );

        await session.commitTransaction(); 
        session.endSession();

        return handleResponse(res, 201, "Account created successfully", true);

    } catch (error) {
        console.log("Registration Error:", error);
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return handleResponse(res, 400, "All fields are required", false);
        }

        // 1️⃣ ADMIN LOGIN (hardcoded)
        if (email === "admin@gmail.com" && password === "admin") {
            const token = jwt.sign({ role: "admin",email,password }, process.env.SECRET_KEY, { expiresIn: "1d" });

            return res.status(200).cookie("token", token, {
                    maxAge: 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: "strict"})
                .json({
                    message: "Login Successfully Admin",
                    role: "admin",
                    success: true});
        }

        // 2️⃣ MANAGER LOGIN (hardcoded)
        if (email === "priya.sharma@gmail.com" && password === "manager01") {
            const token = jwt.sign({ role: "manager",email,password }, process.env.SECRET_KEY, { expiresIn: "1d" });

            return res.status(200)
                .cookie("token", token, {
                    maxAge: 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: "strict"
                })
                .json({
                    message: "Login Successfully Manager",
                    role: "manager",
                    success: true
                });
        }

        // 3️⃣ Check DB for advisor/user/manager (email search)
        const advisor = await Advisor.findOne({ email });
        const user = await User.findOne({ email });
        const manager = await Manager.findOne({ email });

        // 4️⃣ ADVISOR LOGIN (default password support)
        if (advisor) {
            if (password !== "manager0000") {
                return handleResponse(res, 400, "Incorrect password", false);
            }

            const token = jwt.sign({ role: "advisor", id: advisor._id,name:advisor.fullname }, process.env.SECRET_KEY, { expiresIn: "1d" });

            return res.status(200)
                .cookie("token", token, {
                    maxAge: 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: "strict"
                })
                .json({
                    message: "Login Successfully Advisor",
                    info: advisor,
                    role: "advisor",
                    success: true
                });
        }

        // 5️⃣ USER LOGIN
        if (user) {
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (!isPasswordMatch) {
                return handleResponse(res, 401, "Incorrect email or password", false);
            }

            const token = jwt.sign({ role: "user", id: user._id,name:user.name }, process.env.SECRET_KEY, { expiresIn: "1d" });

            return res.status(200)
                .cookie("token", token, {
                    maxAge: 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: "strict"
                })
                .json({
                    message: "Login Successfully User",
                    info: user,
                    role: "user",
                    success: true
                });
        }

        // 6️⃣ MANAGER LOGIN (DB manager)
        if (manager) {
            const isPasswordMatch = await bcrypt.compare(password, manager.password);

            if (!isPasswordMatch) {
                return handleResponse(res, 401, "Incorrect email or password", false);
            }

            const token = jwt.sign({ role: "manager", id: manager._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

            return res.status(200)
                .cookie("token", token, {
                    maxAge: 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    sameSite: "strict"
                })
                .json({
                    message: "Login Successfully Manager",
                    info: manager,
                    role: "manager",
                    success: true
                });
        }

        // If no user found
        return handleResponse(res, 400, "Enter valid email or password", false);

    } catch (error) {
        next(error);
    }
};
// export const logout = async (req, res) => {
//     try {
//         res.status(200).cookie('token', '', { maxAge: 0 }).json({
//             message: "Logout Successfully"
//         });
//     }
//     catch (error) {
//         console.log(error)
//     }
// }
export const fetchAdvisors = async (req, res, next) => {
    const set = new Set();   
    try {
        // const redisAdvisor = await RedisClient.hgetall('advisorlist');
        // for(const item in redisAdvisor){
        //     set.add(JSON.parse(redisAdvisor[item]));
        // }
        // if (set.size > 0) {
        //     const redisAdvisorData = [...set];
        //     return handleResponse(res, 200, "Fetched Advisor (from cache)", true, redisAdvisorData);
        // }
        const advisor = await Advisor.find({ permission: 'allow' });
        // if (advisor && advisor.length > 0) {
        //     await Promise.all(advisor.map(async (item) => {
        //         await RedisClient.hset('advisorlist', item._id, JSON.stringify(item));
        //     }));
        // }
        return handleResponse(res, 200, "Fetched Advisors (from DB)", true, advisor);
    } catch (error) {
        next(error);
    }
}
export const details = async (req, res,next) => {
    const { id } = req.params;
  try {
    const advisor = await Advisor.findById(id);
    if (!advisor) {
        return handleResponse(res,404,"Advisor not found",false);
    }
    return handleResponse(res,200,"Advisor found",true,advisor); 
  } catch (err) {
    next(err)
  }
};
export const fetchManager = async (req, res,next) => {
    try {
        const managers = await Manager.find({});
        return handleResponse(res,200,"Advisor found",true,managers);
    } catch (error) {
        next(error);
    }
};
export const managerinfo = async (req, res,next) => {
    try {
        const manager = await Manager.findById(req.params.id);
        if (!manager) return res.status(404).json({ message: 'Manager not found' });
        return handleResponse(res,200,"Manager not found",true,manager);
    } catch (error) {
        next(error);
    }
};
export const fecthinactive = async (req, res,next) => {
    try {
        const advisors = await Advisor.find({ status: 'inactive' });
        return handleResponse(res,200,"Fetched inactive advisors",true,advisors);
    } catch (error) {
        console.error('Error fetching advisors:', error);
        next(error);
    }
}
export const fecthactive = async (req, res,next) => {
    try {
        const advisors = await Advisor.find({ status: 'active' });
        return handleResponse(res,200,"Fetched active advisors",true,advisors);
    } catch (error) {
        console.error('Error fetching advisors:', error);
        next(error);
    }
}
export const disapproveList = async (req, res,next) => {
    try {
        const advisors = await Advisor.find({ permission: 'notallow' });
        // return res.status(200).json({ success: true, info: advisors });
        return handleResponse(res,200,"Fetched disapproved advisors",true,advisors);
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
        return handleResponse(res,200,"Fetched advisors complain",true,complain);
    } catch (error) {
        console.error('Error fetching advisors complain:', error);
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
        return handleResponse(res,200,"Delete sucessfully",true);
    } catch (error) {
        next(error);
    }
}
export const complainall = async (req, res,next) => {
    try {
        const complainall = await Complain.find({ role: req.params.name });
        // return res.status(200).json({ status: true, data: complainall });
        return handleResponse(res,200,"Fetched all complain",true,complainall);
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
        return handleResponse(res,200,"Successfull",true);
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
      return handleResponse(res,400,"Invalid advisorId or schedule data",false);
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
    return handleResponse(res,200,"Schedule updated successfully",true,advisor.schedule);
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
            return handleResponse(res,404,"User not found",false);
        }

        if (followed.follows.includes(id)) {
            // Unfollow
            followed.follows = followed.follows.filter(item => item !== id);
            await followed.save();
            //return res.status(200).json({ status: true, message: 'unfollowed', info: followed });
            return handleResponse(res,200,"unfollowed",true,followed);
        } else {
            // Follow
            followed.follows.push(id);
            await followed.save();
            //return res.status(200).json({ status: true, message: 'followed', info: followed });
            return handleResponse(res,200,"followed",true,followed);
        }

    } catch (error) {
        next(error);
    }
};
export const approveAdvisor = async (req, res,next) => {
    try {
        const advisor = await Advisor.findById(req.params.id);
        if (!advisor) {
            return handleResponse(res,404,"Advisor not found",false);
        } else {
            advisor.permission = 'allow';
            await advisor.save();
            return handleResponse(res,200,"Advisor created successfully",true);
        }
    }
    catch (error) {
        next(error);
    }
}
export const disapproveAdvisor = async (req, res,next) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const uploadDir = path.join(__dirname, '..', 'files');
        const advisor = await Advisor.findById(req.params.id);
        const files = fs.readdirSync(uploadDir);    
        files.map((img, index) => {
            if (advisor.images.includes(img)) {
                const __imagename = path.join(uploadDir, img)
                fs.unlinkSync(__imagename);
            }
        })

        const deleted = await Advisor.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return handleResponse(res,404,"Advisor not found",false);
        }
        return handleResponse(res,200,"Advisor deleted successfully",true);
    } catch (error) {
        console.error('Disapproval error:', error);
        next(error);
    }
};
export const clientbill = async (req, res, next) => {
    const { id, date, time, clientId, transactionId, price, method } = req.body;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const advisor = await Advisor.findById(id);
        if (!advisor) {
            await session.abortTransaction();
            return handleResponse(res, 400, 'Advisor not found', false);
        }
        const normalizedDay = date.toLowerCase();
        // Check for time slot availability
        if (!advisor.schedule[normalizedDay] || !advisor.schedule[normalizedDay].includes(time)) {
            await session.abortTransaction();
            return handleResponse(res, 400, `Time slot not available on ${normalizedDay}`, false);
        }
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
            await session.abortTransaction();
            await ChatRoom.create({ clientId, advisorId: id, createdAt: new Date() });
        }
 
        const advisorUpdateResult = await Advisor.findByIdAndUpdate(
            id,
            {
                // Atomically remove the time slot from the schedule and add it to tempBlockedSlots
                $pull: { [`schedule.${normalizedDay}`]: time },
                $push: { tempBlockedSlots: { day: normalizedDay, time } },
                
                $inc: { client: 1 }
            },
            { new: true, runValidators: true } 
        );

        await User.findByIdAndUpdate(clientId, { $inc: { totalmet: 1 } });

        if (!advisorUpdateResult) {
            await session.abortTransaction();
            return handleResponse(res, 500, 'Failed to update advisor document', false);
        }
        await session.commitTransaction();
        session.endSession();
        return handleResponse(res, 200, "Slot booked", true);

    } catch (err) {
        console.error('❌ Client bill error:', err.message);
        await session.abortTransaction();
        next(err);
    }finally {
        session.endSession();   // ALWAYS runs
    }
};
export const bookdschedule = async (req, res,next) => {
  const id = req.query.id;
  try {
    const advisor = await Advisor.findById(id);
    if (!advisor) {
      return handleResponse(res,404,"Advisor not found",false);
    }
    return handleResponse(res,200,"book successfully",true,advisor.tempBlockedSlots || []);
  } catch (err) {
    next(err);
  }
};
export const transactionManager = async (req, res,next) => {
    try {
        const data = await PaymentRecords.find({});
        return handleResponse(res,200,"Data fetched successfully",true,data);
    } catch (err) {
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
        return handleResponse(res,200,"OTP sent successfully",true,otp);
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
        return handleResponse(res, 200, "Gender detected", true,  response.data);
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
            return handleResponse(res, 500, 'Failed to update new Password', false);
        }
        return handleResponse(res, 200, 'Update Password', true);
    }catch(error){
        next(error);
    }
}
