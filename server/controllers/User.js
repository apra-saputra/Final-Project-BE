const { comparePassword } = require('../helpers/bcrypt');
const { encodeToken } = require('../helpers/jwt');
const transporter = require('../helpers/nodemailer');
const { User, sequelize } = require('../models');
// const { OAuth2Client } = require('google-auth-library');
// const CLIENT_ID = process.env.GOOGLE_CLIENT_ID

class Users {
  static async Register(req, res, next) {
    const { username, fullname, email, password } = req.body
    const t = await sequelize.transaction();
    try {
      const user = await User.create({
        username, fullname, email, password, role: "User"
      }, { transaction: t });
      const emailText = {
        from: "silaenjacob@gmail.com",
        to: user.dataValues.email,
        subject: "DIT-HUB Registration Complete Email",
        text: "Welcome, You have been registered to DIT-HUB",
      }
      await transporter.sendMail(emailText);
      t.commit();
      delete user.dataValues.email;
      delete user.dataValues.password;
      res.status(201).json({ message: "User Created", user });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  static async Login(req, res, next) {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        throw ({ name: "invalid_login" });
      }
      const user = await User.findOne({
        where: { email }
      })
      if (!user) {
        throw ({ name: "invalid_login" });
      }
      if (!comparePassword(password, user.password)) {
        throw ({ name: "invalid_login" });
      }
      const payload = { id: user.id };
      const access_token = encodeToken(payload);
      res.status(200).json({ access_token })
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      let user = await User.findByPk(req.user.id, {
        attributes: ["id", "username", "fullname", "email", "role"]
      });
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  // static async Google(req, res, next) {
  //   try {
  //     const google_token = req.headers.google_token
  //     const client = new OAuth2Client(CLIENT_ID);
  //     const ticket = await client.verifyIdToken({
  //       idToken: google_token,
  //       audience: CLIENT_ID
  //     });
  //     const payload = ticket.getPayload();
  //     let user;
  //     [user] = await User.findOrCreate({
  //       where: {
  //         email: payload.email
  //       },
  //       defaults: {
  //         username: payload.given_name,
  //         email: payload.email,
  //         password: 'google_auth',
  //         role: "Staff",
  //       },
  //       hooks: false
  //     })
  //     const access_token = encodeToken({
  //       id: user.id
  //     })
  //     res.status(200).json({ message: "Login OK", access_token })
  //   } catch (err) {
  //     next(err);
  //   }
  // }
}

module.exports = Users;