"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Step extends Model {
    static associate(models) {
      Step.belongsTo(models.Project, { foreignKey: "ProjectId" });
    }
  }
  Step.init(
    {
      ProjectId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: false,
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      imgUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Step",
    }
  );
  return Step;
};
