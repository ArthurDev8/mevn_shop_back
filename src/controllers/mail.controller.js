const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

const transporter = nodemailer.createTransport(smtpTransport({
  service: 'Gmail',
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
}));

const sendEmail = () => { };

const createUserConfirmationOrderEmail = async ({ _id, email }) => {
  let info = await transporter.sendMail({
    from: `"MevnShop" ${process.env.NODEMAILER_USER}`,
    to: `${email}`,
    subject: "Order Confirmation",
    text: `Ваш заказ ${_id} подтверждён`,
    html: `<b>Ваш заказ ${_id} подтверждён</b>`,
  });
  return info;
};
const createAdminConfirmationOrderEmail = async ({ _id, address, fullname, phone }, adminEmail = 'testformevnshop@gmail.com') => {
  let info = await transporter.sendMail({
    from: `"MevnShop" ${process.env.NODEMAILER_USER}`,
    to: `${adminEmail}`,
    subject: "Новый заказ",
    text: `Создан заказ с номером ${_id}`,
    html: `<h2>Новый заказ с номером ${_id}</h2>
    <ul>
      <li>address - ${address}</li>
      <li>fullName - ${fullname}</li>
      <li>phone - ${phone}</li>
    </ul>
    `,
  });
  return info;
};


module.exports = {
  createUserConfirmationOrderEmail,
  createAdminConfirmationOrderEmail
}