import nodemailer from "nodemailer";
import dotenv from "dotenv";

$("button").click(function(){
    let name=$(".user").val();
    let email=$(".emailEntered").val();
    let issue=$(".issueText").val();

    createStatement(name,email,issue)
})
function createStatement(name,email,issue){
    let preparedStatement="Hello, "+name+"\n\t"+"This is the email that we were contacted from: "+email+"\n\t"+"This is the issue we are trying to resolve: "+issue+"\n\t"+"We are working hard to resolve your issue! If you have any further questions please contact us at: helpdesk.directory@gmail.com.";
    sendEmail(email,preparedStatement);
}

dotenv.config();

const transporter=nodemailer.createTransport({
    host:"smtp.gmail.com",
    port: 587,
    secure:false,
    auth:{
        user:process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

function sendEmail(email,preparedStatement){
    transporter.sendMail({
        from:"helpdesk.directory@gmail.com",
        to:email,
        subject:generateSubject(),
        html:preparedStatement
    });
    alert("Email Sent Successfully")
}

function generateSubject(){
    var ticketNum=Math.ceil(Math.random()*1000000);
    console.log(ticketNum);
    return "Support Ticket: "+"AA155-"+ticketNum;
}


