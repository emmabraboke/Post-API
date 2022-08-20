import nodemailer from 'nodemailer';
import config from '../../config/default.js';

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  var mailOptions = {
    from: 'brabokemma@gmail.com',
    to,
    subject,
    html,
  };

  const message = await transporter.sendMail(mailOptions);
  return message;
};

export default sendEmail;
