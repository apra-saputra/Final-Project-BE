const { getPagination, getPagingData } = require("../helpers/pagination");
const { Comment } = require("../models");

class CommentController {
  static async createComment(UserId, ProjectId, comment) {
    if (!ProjectId) {
      throw { name: "project_not_found" };
    }

    await Comment.create({
      ProjectId,
      UserId,
      comment,
    });

    return { message: `Comment has been created` };
  }

  static async readComment(ProjectId, page) {
    const options = { where: { ProjectId } };
    options.limit = getPagination(page).limit;
    options.offset = getPagination(page).offset;
    const result = {
      Comments: await Comment.findAndCountAll(options),
    };
    const responses = getPagingData(result, page, getPagination(page).limit);
    return responses;
  }

  static async deleteComment(req, res, next) {
    try {
      await Comment.destroy({
        where: { id: req.params.commentId },
      });
			res.json({ message: `Comment with has been deleted`})
    } catch (error) {
      next(error)
    }
  }
}

module.exports = CommentController;
