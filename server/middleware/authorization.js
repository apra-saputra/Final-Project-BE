const { Favorite, Report, Comment, Project } = require("../models");

class Authorization {
  static async deleteFavorite(req, res, next) {
    try {
      const { favid } = req.params;
      const favorite = await Favorite.findByPk(favid);

      if (!favorite) {
        throw { name: "project_not_found" };
      }
      if (favorite.UserId != req.user.id) {
        throw { name: "forbidden" };
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  static async deleteProject(req, res, next) {
    try {
      const { id } = req.params;
      const project = await Project.findByPk(id);
      if (!project) {
        throw { name: "project_not_found" };
      }
      if (req.user.role != "Admin") {
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
      const report = await Report.findByPk(reportid);
      if (!report) {
        throw { name: "report_not_found" };
      }
      if (req.user.role != "Admin") {
        throw { name: "forbidden" };
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  static async getReportAdmin(req, res, next) {
    try {
      if (req.user.role != "Admin") {
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
