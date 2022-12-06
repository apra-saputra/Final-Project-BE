const { Report } = require("../models");

module.exports = class ReportControl {
  static async readReport(req, res, next) {
    try {
      const reports = await Report.findAll()
      res.status(200).json({ reports: reports });
    } catch (err) {
      next(err);
    }
  }

  static async readReportByProject(req, res, next) {
    try {
      const report = await Report.findOne({ where: { ProjectId: req.params.projectid } })
      if (!report) {
        throw ({ name: "report_not_found" })
      }
      res.json({
        reports: report,
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
      const { reportid } = req.params
      await Report.destroy({ where: { id: reportid } });
      res.json({
        message: `Report with id : ${reportid} has been deleted`
      })
    } catch (err) {
      next(err);
    }
  }
};
