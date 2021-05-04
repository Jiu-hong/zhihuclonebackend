import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getQuestions,
  getQuestionsbyCreator,
  getQuestionsbyFollow,
  getCertainQuestion,
  // createQuestionAnonymous,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  followQuestion,
  getQuestionsbyTopic,
} from "../controllers/question.js";

const route = express.Router();

route.get("/", getQuestions);

route.get("/creator/:creator", getQuestionsbyCreator);

route.get("/questionbyfollow/:followid", getQuestionsbyFollow);

route.get("/questionbytopic/:topicid", getQuestionsbyTopic);

route.get("/:questionid", getCertainQuestion);

route.post("/", auth, createQuestion);

// route.post("/anonymous", auth, createQuestionAnonymous);

route.patch("/:id", auth, updateQuestion);

route.delete("/:id", auth, deleteQuestion);

route.patch("/follow/:id", auth, followQuestion);

export default route;
