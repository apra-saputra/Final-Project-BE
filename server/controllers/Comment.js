const { getLoaderMore, getLoadMoreData } = require("../helpers/pagination");
const { Comment, User } = require("../models");

class CommentController {
  static async createComment(UserId, ProjectId, comment) {
    try {
      if (!ProjectId) {
        throw { message: "project not found" };
      }
      await Comment.create({
        ProjectId,
        UserId,
        comment,
      });
      return { message: `Comment has been created` };
    } catch (err) {
      return (err)
    }
  }

  static async readComment(ProjectId, limit) {
    const options = {
      include: { model: User, attributes: ["username"] },
      where: { ProjectId },
    };
    options.limit = getLoaderMore(limit).limit;
    const result = {
      Comments: await Comment.findAndCountAll(options),
    };
    const responses = getLoadMoreData(
      result.Comments,
      getLoaderMore(limit).limit
    );
    return responses;
  }

  static async deleteComment(req, res, next) {
    try {
      await Comment.destroy({
        where: { id: req.params.commentId },
      });
      res.json({ message: `Comment with has been deleted` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CommentController;
