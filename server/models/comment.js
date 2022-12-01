"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, { foreignKey: "UserId" });
      Comment.belongsTo(models.Project, { foreignKey: "ProjectId" });
    }
  }
  Comment.init(
    {
      ProjectId: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
      UserId: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
      comment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
