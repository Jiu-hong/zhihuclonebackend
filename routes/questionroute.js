import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getQuestions,
  getCertainQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  followQuestion,
} from "../controllers/question.js";

const route = express.Router();

route.get("/", getQuestions);

route.get("/:questionid", getCertainQuestion);

route.post("/", auth, createQuestion);

route.patch("/:id", auth, updateQuestion);

route.delete("/:id", auth, deleteQuestion);

route.patch("/follow/:id", auth, followQuestion);

export default route;
