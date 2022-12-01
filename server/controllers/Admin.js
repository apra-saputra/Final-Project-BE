const { comparePassword } = require('../helpers/bcrypt');
const { encodeToken } = require('../helpers/jwt');
const { User } = require('../models');

class Admin {
  static async Register(req, res, next) {
    const { username, fullname, email, password } = req.body
    try {
      const admin = await User.create({
        username, fullname, email, password, role: "Admin"
      });
      delete admin.dataValues.email;
      delete admin.dataValues.password;
      res.status(201).json({ message: "User Created", admin });
    } catch (error) {
      next(error);
    }
  }

  static async Login(req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({
        where: { email }
      })
      if (!user) {
        throw ({ name: "invalid_login" });
      }
      if (!comparePassword(password, user.password)) {
        throw ({ name: "invalid_login" });
      }
      if (user.role != "Admin" && req.baseUrl == '/admin') {
        throw ({ name: "forbidden" });
      }
      const payload = { id: user.id };
      const access_token = encodeToken(payload);
      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      let admin = await User.findByPk(req.user.id, {
        attributes: ["id", "username", "fullname", "email", "role"]
      });
      res.status(200).json(admin);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Admin;