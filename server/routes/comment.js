const express = require("express");
const Comment = require("../controllers/Comment");
const Authorization = require("../middleware/authorization");

const comment = express.Router();

comment.get("/", Comment.getComments);
comment.delete("/:id", Authorization.deleteComment, Comment.deleteComment);

module.exports = comment;
