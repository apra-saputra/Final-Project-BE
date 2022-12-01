'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Steps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ProjectId: {
				allowNull: false,
        type: Sequelize.INTEGER,
				references: {
					model: "Projects",
					key: "id"
				},
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE'
      },
      name: {
				allowNull: false,
        type: Sequelize.STRING
      },
      description: {
				allowNull: false,
        type: Sequelize.STRING
      },
      imgUrl: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Steps');
  }
};