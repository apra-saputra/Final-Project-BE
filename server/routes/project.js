const express = require("express");
const project = express.Router();
const multer = require("multer");
const Projects = require("../controllers/Projects");
const StepControl = require("../controllers/Step");

const upload = multer();
const mUpload = upload.fields([
  { name: "images", maxCount: 20 },
  { name: "mainImage", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);
project.post("/project", mUpload, Projects.Create);
project.patch("/project/:projectid", Projects.SoftDelete);

module.exports = project;
