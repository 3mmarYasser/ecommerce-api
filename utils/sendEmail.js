const nodemailer = require('nodemailer');
const sendEmail = async (email, subject, message,html) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    })
    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject,
        text: message,
        html
    }
   await transporter.sendMail(mailOptions)
}
module.exports = sendEmail;