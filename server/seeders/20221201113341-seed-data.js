'use strict';

const { hashPassword } = require('../helpers/bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = require('../data.json').Users
		users.map(u => {
			u.password = hashPassword(u.password)
			u.createdAt = u.updatedAt = new Date()
		})
		
		const tags = require('../data.json').Tags
		tags.map(t => {
			t.createdAt = t.updatedAt = new Date()
		})

		const projects = require('../data.json').Projects
		projects.map(p => {
			p.createdAt = p.updatedAt = new Date()
		})

		const comments = require('../data.json').Comments
		comments.map(c => {
			c.createdAt = c.updatedAt = new Date()
		})

		const steps = require('../data.json').Steps
		steps.map(s => {
			s.createdAt = s.updatedAt = new Date()
		}) 

		await queryInterface.bulkInsert("Users", users)
		await queryInterface.bulkInsert("Tags", tags)
		await queryInterface.bulkInsert("Projects", projects)
		await queryInterface.bulkInsert("Comments", comments)
		await queryInterface.bulkInsert("Steps", steps)		
  },

  async down (queryInterface, Sequelize) {
		await queryInterface.bulkDelete("Steps", null, {
			truncate: true,
			restartIdentity: true,
			cascade: true
		})
		
		await queryInterface.bulkDelete("Comments", null, {
			truncate: true,
			restartIdentity: true,
			cascade: true
		})

		await queryInterface.bulkDelete("Projects", null, {
			truncate: true,
			restartIdentity: true,
			cascade: true
		})

    await queryInterface.bulkDelete("Users", null, {
			truncate: true,
			restartIdentity: true,
			cascade: true
		})

		await queryInterface.bulkDelete("Tags", null, {
			truncate: true,
			restartIdentity: true,
			cascade: true
		})		
  }
};
