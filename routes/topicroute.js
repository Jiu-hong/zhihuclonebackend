import express from "express";

import {
  getAllTopics,
  getCertainTopic,
  deleteCertainTopic,
  createTopic,
} from "../controllers/topic.js";

const route = express.Router();

route.get("/", getAllTopics);
route.get("/:topicid", getCertainTopic);
route.delete("/:topicid", deleteCertainTopic);
route.post("/", createTopic);

export default route;
