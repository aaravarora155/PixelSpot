import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

function generateSubject() {
    const ticketNum = Math.ceil(Math.random() * 1000000);
    return "Support Ticket: Pixel Spot - " + ticketNum;
}

router.post("/send-email", async (req, res) => {
    console.log("Request body:", req.body);
    const { name, email, issue } = req.body;

    if (!name || !email || !issue) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const preparedStatement = `
    <p>Hello ${name},</p>
    <p>We received a request from your email: <strong>${email}</strong></p>
    <p>Issue details:</p>
    <p>${issue}</p>
    <p>We are working hard to resolve your issue. If you have any further questions, please contact us at: <a href="mailto:helpdesk.directory@gmail.com">helpdesk.directory@gmail.com</a>.</p>
    <p>Thank you,<br>
    The Support Team</p>
    `;

    try {
        await transporter.sendMail({
            from: "helpdesk.directory@gmail.com",
            to: email,
            bcc: "helpdesk.directory@gmail.com",
            subject: generateSubject(),
            html: preparedStatement
        });
        res.json({ success: true, message: "Email sent successfully" });
    } catch (err) {
        console.error("Error sending email:", err);
        res.status(500).json({ success: false, message: "Failed to send email" });
    }
});

export default router;
