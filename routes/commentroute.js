import express from "express";

import {
  getAllComments,
  createComment,
  updateComment,
  likeComment,
  deleteComment,
} from "../controllers/comment.js";

import { auth } from "../middleware/auth.js";

const route = express.Router();

route.get("/", getAllComments);

route.post("/:postid", auth, createComment);
route.patch("/:commentid", auth, updateComment);
route.patch("/like/:commentid", auth, likeComment);
route.delete("/:commentid", auth, deleteComment);

export default route;
