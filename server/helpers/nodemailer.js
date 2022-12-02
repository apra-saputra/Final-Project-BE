const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "silaenjacob@gmail.com", //ganti mail ga?
    pass: "cirzdezmtjbnkrpy" //kalo google ada metode sendiri
  }
});

module.exports = transporter;