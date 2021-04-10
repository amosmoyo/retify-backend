const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log(options);
  // create a tranporter function (use nodemailer docs)
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASS // generated ethereal password
    }
  });

  // send mail with defined transport object
  const info = {
    from: 'Amos Moyo <amosmoyo5300@gmail.com>', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.text // plain text body
    // html: "<b>Hello world?</b>", // html body
  };

  // send email
  await transporter.sendMail(info);
};

module.exports = sendEmail;
