import express from "express";

import { getAll } from "../controllers/search.js";

const route = express.Router();

route.post("/", getAll);

export default route;
