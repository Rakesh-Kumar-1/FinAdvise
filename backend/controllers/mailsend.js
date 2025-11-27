import { createTransport } from "nodemailer";
import  dotenv  from "dotenv";

dotenv.config();
const transporter = createTransport({
    service: "gmail",
    auth: {
        user: process.env.USER,          // your Gmail address 
        pass: process.env.PASS          // 16-digit App Password
    },
});

export const mail = async (req, res) => {
    const { participants, subject, text } = req.body;
    const recipients = participants;

    const mailOptions = {
        from: process.env.USER,  // brand.si3168@gmail.com 
        to: recipients.join(","), 
        subject: subject, 
        text: text 
    };
    try {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(" Error sending email:", error);
            } else {
                console.log(" Email sent:", info.response);
            }
        })
        return res.status(200).json({ status: true, message: "send mail" })
    } catch (error) {
        return res.status(500).json({ status: false, message: "not send mail" })
    }
};
