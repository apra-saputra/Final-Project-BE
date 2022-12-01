'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
				allowNull: false,
        type: Sequelize.INTEGER,
				references: {
					model: "Users",
					key: "id"
				},
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE'
      },
      title: {
				allowNull: false,
        type: Sequelize.STRING
      },
      slug: {
				allowNull: false,
        type: Sequelize.STRING,
      },
      imgUrl: {
        type: Sequelize.STRING
      },
      introduction: {
				allowNull: false,
        type: Sequelize.TEXT
      },
			difficulty: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			TagId: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: {
					model: "Tags",
					key: "id"
				},
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Projects');
  }
};