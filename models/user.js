'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
			User.hasMany(models.Project, { foreignKey: 'UserId'})
			User.hasMany(models.Favorite, { foreignKey: 'UserId'})
			User.hasMany(models.Comment, { foreignKey: 'UserId'})
    }
  }
  User.init({
    username: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				notNull: { message: `Username is required` },
				notEmpty: { message: `Username is required` },				
			}
		},
    fullname: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				notNull: { message: `Fullname is required` },
				notEmpty: { message: `Fullname is required` },				
			}
		},
    role: DataTypes.STRING,
    email: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				notNull: { message: `Email is required` },
				notEmpty: { message: `Email is required` },
				isEmail: { message: `Incorrect email format` },
			},
			unique: {
				args: true,
				message: `Email is already used`,
			},
		},
    password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notNull: { msg: `Password required` },
				notEmpty: { msg: `Password required` },
			},
		},
  }, {
    sequelize,
    modelName: 'User',
  });

	User.beforeCreate((user) => {
		user.password = hashPassword(user.password)
	})

  return User;
};