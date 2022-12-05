"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.hasOne(models.Favorite, { foreignKey: "ProjectId" });
      Project.hasMany(models.Comment, { foreignKey: "ProjectId" });
      Project.hasMany(models.Step, { foreignKey: "ProjectId" });
      Project.belongsTo(models.User, { foreignKey: "UserId" });
			Project.belongsTo(models.Tag)
    }
  }
  Project.init(
    {
      UserId: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
      title: {
				allowNull: false,
				type: DataTypes.STRING,
			},
      slug: {
				allowNull: false,
				type: DataTypes.STRING,
			},
      imgUrl: DataTypes.STRING,
      introduction: {
				allowNull: false,
				type: DataTypes.TEXT,
			},
			difficulty: {
				type: DataTypes.STRING
			},
			TagId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Project",
    }
  );

		// Project.beforeCreate((projects, option) => {
		// 	projects.slug = projects.title.replace(' ', '-')
		// })

  return Project;
};
