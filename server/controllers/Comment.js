const { Comment } = require('../models')


class Comment {
	static async createComment(req,res,next){
		try {
			const UserId = req.user.id
			const ProjectId = req.params.id
			const comment = req.body

			if (!ProjectId){
				throw { name: "project_not_found" };
			}

			const result = await Comment.create({
				ProjectId,
				UserId,
				comment
			})

			res.status(200).json({ message: `Comment has been deleted`})
		} catch (error) {
			next(error)
		}
	}

	static async readComment(req,res,next){
		try {
			res.json({
        Comments: await Comment.findAll({where: {ProjectId: req.params.projectid}}),
      });

			// pagination blm di implement
		} catch (error) {
			next(error)
		}
	}

	static async deleteComment(req,res,next){
		try {
			// help hahahaha
		} catch (error) {
			res.status(500).json(error) // sementara res status 500 dulu
		}
	}
}

module.exports = Comment