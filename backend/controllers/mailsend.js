import { createTransport } from "nodemailer";

// Create reusable transporter using Gmail
const transporter = createTransport({
    service: "gmail",
    auth: {
        user: "brandy.singh0001@gmail.com",          // your Gmail address 
        pass: "nsvyowthwkdxiwgt"          // 16-digit App Password
    },
});

export const mail = async (req, res) => {
    const { participants, subject, text } = req.body;
    // List of recipients (can also be comma-separated string)
    // const recipients = [
    //     "friend1@example.com",
    //     "friend2@example.com",
    //     "friend3@example.com"
    // ];
    const recipients = participants;

    const mailOptions = {
        from: "brand.si3168@gmail.com",   // your Gmail address  // brand.si3168@gmail.com 
        to: recipients.join(","), // Join recipients as comma-separated string
        subject: subject,  //"Nodemailer Test to Multiple People", 
        text: text  //"Hi all! This is a test email sent from Nodemailer using Gmail and App Password.",
    };
    try {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("❌ Error sending email:", error);
            } else {
                console.log("✅ Email sent:", info.response);
            }
        })
        return res.status(200).json({ status: true, message: "send mail" })
    } catch (error) {
        return res.status(500).json({ status: false, message: "not send mail" })
    }
};
