"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    static associate(models) {
      Favorite.belongsTo(models.User, { foreignKey: "UserId" });
      Favorite.belongsTo(models.Project, { foreignKey: "ProjectId" });
    }
  }
  Favorite.init(
    {
      ProjectId: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
      UserId: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
    },
    {
      sequelize,
      modelName: "Favorite",
    }
  );
  return Favorite;
};
