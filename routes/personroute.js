import express from "express";

import {
  getallforperson,
  followperson,
  allperson,
} from "../controllers/person.js";
import { auth } from "../middleware/auth.js";

const route = express.Router();

route.post("/getallforperson", getallforperson);
route.post("/followperson", auth, followperson);
route.get("/", allperson);

export default route;
