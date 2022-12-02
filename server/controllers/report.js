const { Report } = require("../models");

module.exports = class ReportControl {
  static async readReport(req, res, next) {
    try {
      res.json({
        reports: await Report.FindAll(),
      });
    } catch (err) {
      next(err);
    }
  }

  static async readReportByProject(req, res, next) {
    try {
      res.json({
        reports: await Report.findOne({where: {ProjectId: req.params.projectid}}),
      });
    } catch (err) {
      next(err);
    }
  }

  static async createReport(req, res, next) {
    try {
      const { id } = req.user;
      const { projectid } = req.params;
      const [report, created] = await Report.findOrCreate({
        where: { ProjectId: projectid, UserId: id },
        defaults: {
          ProjectId: projectid,
          UserId: id,
        },
      });

      if (created) {
        res
          .status(201)
          .json({ message: `Project Id : ${report.id} has been add to report` });
      } else {
        throw { name: "duplicate_report" };
      }
    } catch (err) {
      next(err);
    }
  }

  static async deleteReport(req, res, next) {
    try {
      const { reportId } = req.params;
      await Report.destroy();

    res.json({
        message: `Report with id : ${favId}`
    })  
    } catch (err) {
      next(err);
    }
  }
};
