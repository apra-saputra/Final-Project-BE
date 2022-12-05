const { Favorite, Report, Comment } = require("../models");

class Authorization {
  static async deleteFavorite(req, res, next) {
    try {
      const { favid } = req.params;
      const favorite = await Favorite.findByPk(favid);

      if (!favorite) {
        throw { name: "project_not_found" };
      }
      if (favorite.UserId != req.user.id || req.user.role != "Admin") {
        throw { name: "forbidden" };
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  static async deleteReport(req, res, next) {
    try {
      const { reportid } = req.params;
      const report = await Report.findByPk(reportId);

      if (!report) {
        throw { name: "project_not_found" };
      }
      if (report.UserId != req.user.id || req.user.role != "Admin") {
        throw { name: "forbidden" };
      }
      next();
    } catch (err) {
      next(err);
    }
  }

	static async deleteComment(req, res, next) {
    try {
      const { commentId } = req.params;
      const comment = await Comment.findByPk(commentId);

      if (!comment) {
        throw { name: "comment_not_found" };
      }
      if (comment.UserId != req.user.id || req.user.role != "Admin") {
        throw { name: "forbidden" };
      }
      next();
    } catch (err) {
      next(err);
    }
  }
}
module.exports = Authorization;
