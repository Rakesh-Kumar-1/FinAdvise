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

export const register = async (req, res) => {
    try {
        const { name, email, password, gender } = req.body;

        // Validate input fields (optional but recommended)
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email", success: false });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate profile photo URL
        const profilePhoto = `https://avatar.iran.liara.run/public/${gender}`;

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            image: profilePhoto,
        });

        return res.status(201).json({
            message: "Account created successfully",
            success: true
        });
    } catch (error) {
        console.log("Registration Error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const user = await User.findOne({ email });
        const manager = await Manager.findOne({ email });
        const advisor = await Advisor.findOne({ email });

        // Advisor login with default password
        if (advisor && email === advisor.email && password === "manager0000") {
            return res.status(200).json({ message: "Login Successfully Advisor", success: true, info: advisor });
        }

        // Admin login
        if (email === "admin@gmail.com" && password === "admin") {
            return res.status(200).json({ message: "Login Successfully Admin", success: true });
        }

        if (!user && !manager) {
            return res.status(400).json({ message: "Enter valid email or password", success: false });
        }

        const isPasswordMatch = user
            ? await bcrypt.compare(password, user.password)
            : await bcrypt.compare(password, manager.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Incorrect email or password", success: false });
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
        console.log("Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
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
export const fetchAdvisors = async (req, res) => {
    try {
        const advisors = await Advisor.find({ permission: 'allow' });
        return res.status(200).json({ success: true, data: advisors });
    } catch (error) {
        console.error('Error fetching advisors:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};
export const details = async (req, res) => {
    try {
        const advisor = await Advisor.findById(req.params.id);
        if (!advisor) return res.status(404).json({ message: 'Advisor not found' });
        return res.status(200).json(advisor);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};
export const fetchManager = async (req, res) => {
    try {
        const managers = await Manager.find({});
        return res.status(200).json({ success: true, data: managers });
    } catch (error) {
        console.error('Error fetching advisors:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};
export const managerinfo = async (req, res) => {
    try {
        const manager = await Manager.findById(req.params.id);
        if (!manager) return res.status(404).json({ message: 'Manager not found' });
        return res.status(200).json(manager);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};
export const fecthinactive = async (req, res) => {
    try {
        const advisors = await Advisor.find({ status: 'inactive' });
        return res.status(200).json({ success: true, data: advisors });
    } catch (error) {
        console.error('Error fetching advisors:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}
export const fecthactive = async (req, res) => {
    try {
        const advisors = await Advisor.find({ status: 'active' });
        return res.status(200).json({ success: true, data: advisors });
    } catch (error) {
        console.error('Error fetching advisors:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}
export const disapproveList = async (req, res) => {
    try {
        const advisors = await Advisor.find({ permission: 'notallow' })
        return res.status(200).json({ success: true, info: advisors });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}
export const complaintype = async (req, res) => {
    try {
        const complain = await Complain.find({ role: req.params.name, status: 'Unsolved' });

        return res.status(200).json({ success: true, data: complain });
    } catch (error) {
        console.error('Error fetching advisors complain:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}
export const complain = async (req, res) => {
    try {
        const { feedback, name, index } = req.body;
        const complain = await Complain.findById(index);
        complain.status = 'Solved';
        complain.feedback = feedback;
        await complain.save();
        return res.status(200).json({ sucess: true, message: 'Delete sucessfully' })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
}
export const complainall = async (req, res) => {
    try {
        const complainall = await Complain.find({ role: req.params.name })
        return res.status(200).json({ status: true, data: complainall });
    } catch (err) {
        return res.status(500).json({ status: false, message: 'Server Error' });
    }
}
export const complainForm = async (req, res) => {
    try {
        const { sender, subject, description, role } = req.body;
        const complain = await Complain.create({
            sender,
            subject,
            description,
            role
        })
        await complain.save();
        return res.status(200).json({ status: true, message: 'Successfull' });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Server Error' });
    }
}
export const schedule = async (req, res) => {
    // try {
    //     const { selectedTimes, id } = req.body;
    //     const advisor = await Advisor.findByIdAndUpdate(id,{
    //     $set: {
    //       'schedule.monday': selectedTimes.monday || [],
    //       'schedule.tuesday': selectedTimes.tuesday || [],
    //       'schedule.wednesday': selectedTimes.wednesday || [],
    //       'schedule.thursday': selectedTimes.thursday || [],
    //       'schedule.friday': selectedTimes.friday || [],
    //       'schedule.saturday': selectedTimes.saturday || [],
    //       'schedule.sunday': selectedTimes.sunday || [],
    //     }
    //   },
    //   { new: true }
    // );
    //     return res.status(200).json({ status: true, message: 'Successfull' });
    // } catch (err) {
    //     return res.status(500).json({ status: false, message: 'Server Error' });
    // }
    const { advisorId, schedule } = req.body;

  try {
    // Validate inputs
    if (!advisorId || typeof schedule !== 'object') {
      return res.status(400).json({ msg: 'Invalid advisorId or schedule data' });
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
    res.status(200).json({ msg: 'Schedule updated successfully', schedule: advisor.schedule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
}
export const followRequest = async (req, res) => {
    try {
        const user = req.body.user;
        const id = req.body.id;
        console.log(user, id);
        const followed = await User.findById(user);
        if (!followed) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        // Check if already following
        if (followed.follows.includes(id)) {
            // Unfollow
            followed.follows = followed.follows.filter(item => item !== id);
            await followed.save();
            return res.status(200).json({ status: true, message: 'unfollowed', info: followed });
        } else {
            // Follow
            followed.follows.push(id);
            await followed.save();
            return res.status(200).json({ status: true, message: 'followed', info: followed });
        }

    } catch (error) {
        console.error("Follow Request Error:", error);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
};
export const approveAdvisor = async (req, res) => {
    try {
        const advisor = await Advisor.findById(req.params.id);
        if (!advisor) {
            return res.status(500).json({ status: true, message: 'Advisor not found' })
        } else {
            advisor.permission = 'allow';
            await advisor.save();
            return res.status(200).json({ status: true, message: 'Advisor created successfully' });
        }
    }
    catch (error) {
        return res.status(500).json({ status: false, message: 'Server error' });
    }
}
export const disapproveAdvisor = async (req, res) => {
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
            return res.status(404).json({ status: false, message: 'Advisor not found' });
        }

        return res.status(200).json({ status: true, message: 'Advisor deleted successfully' });
    } catch (error) {
        console.error('Disapproval error:', error);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
};
export const new_schedule = async (req,res) => {
    const { id,date,time,clientId,transactionId,price,method} = req.body;
    try {
        const advisor = await Advisor.findById(id);

        if (!advisor) return res.status(404).json({ msg: 'Advisor not found' });
        
        //
        await PaymentRecords.create({
            transcationId: transactionId,
            amount: price,
            senderId:clientId,
            recieverId:id,
            payment_method: method,
            day:date,
            time:time
        })


        // Remove slot from schedule
        advisor.schedule[day] = advisor.schedule[day].filter(t => t !== time);

        // Add to temporary blocked slots
        advisor.tempBlockedSlots.push({ day, time });

        await advisor.save();
        res.status(200).json({ msg: 'Slot booked' });
    } catch (err) {
        res.status(500).json({ msg: 'Error blocking slot', error: err.message });
    }
}
export const bookdschedule = async(req,res) => {
    const {id} = req.body;
    try{
        const booked = await Advisor.findById(id);
        if(!booked){
            return res.status(500).json({status:false});
        }else{
            return res.status(200).json({status:true, info:booked.tempBlockedSlots});
        }
    }catch(err){
        return res.status(500).json({status:false});
    }
}
