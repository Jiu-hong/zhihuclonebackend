import express from "express";
import { auth } from "../middleware/auth.js";

import {
  getAnswers,
  getAnswersbyCreator,
  getAnswersbyLike,
  getCertainAnswers,
  getAnswer,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  likeAnswer,
  getAnswersbyTopic,
} from "../controllers/answer.js";

const route = express.Router();

route.get("/", getAnswers);

route.get("/creator/:creator", getAnswersbyCreator);

route.get("/answersbylike/:likeid", getAnswersbyLike);

route.get("/qasbytopic/:topicid", getAnswersbyTopic);

route.get("/answer/:answerid", getAnswer); //??still needed

route.get("/:questionid", getCertainAnswers);

route.post("/:questionid", auth, createAnswer);

route.patch("/:id", auth, updateAnswer);

route.patch("/like/:id/", auth, likeAnswer);

route.delete("/:id", auth, deleteAnswer);

export default route;
