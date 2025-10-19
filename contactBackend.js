import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-email", (req, res) => {
    console.log("Request body:", req.body);
    res.json({ message: "Email request received!" });
});

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
    return "Support Ticket:"+ "AA155-"+ticketNum;
}

app.post("/send-email", async (req, res) => {
    const { name, email, issue } = req.body;

    const preparedStatement = `
    <p>Hello ${name},</p>

    <p>We received a request from your email: <strong>${email}</strong></p>

    <p>Issue details:</p>
    ${issue}

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
        // res.json({ success: true, message: "Email sent successfully" });
    } catch (err) {
        console.error(err);
        // res.status(500).json({ success: false, message: "Failed to send email" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
