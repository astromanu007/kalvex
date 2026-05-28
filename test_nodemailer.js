require('dotenv').config({ path: './.env' });
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

transporter.sendMail({
  from: `Kalvex Labs <${process.env.GMAIL_USER}>`,
  to: process.env.GMAIL_USER, // send to self for test
  subject: 'Nodemailer Test Email',
  text: 'This is a test email from Kalvex project.',
}).then(info => {
  console.log('Email sent:', info.response);
}).catch(err => {
  console.error('Error sending email:', err);
});
