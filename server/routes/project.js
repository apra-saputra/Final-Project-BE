const express = require('express');
const project = express.Router();
const multer = require('multer');
const Projects = require('../controllers/Projects');

const upload = multer()
const mUpload = upload.fields([{ name: 'images', maxCount: 20 }, { name: 'mainImage', maxCount: 1 }])
project.post('/project', mUpload, Projects.Create);

module.exports = project;