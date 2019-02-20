const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, code) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Account verification',
      text: 'Your verification code is ' + code + ' 🛂.'
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error);
      } else {
        console.log('Email sent: ' + JSON.stringify(info));
        resolve(info);
      }
    });
  })
}

module.exports = {
  sendVerificationEmail
}