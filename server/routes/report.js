
const express = require('express');
const ReportControl = require('../controllers/report');
const Authorization = require('../middleware/authorization');
const report = express.Router();

report.get('/', ReportControl.readReport);
report.get('/:projectid', ReportControl.readReportByProject)
report.post('/:projectid', ReportControl.createReport)
report.delete('/:reportid', Authorization.deleteReport, ReportControl.deleteReport)

module.exports = report