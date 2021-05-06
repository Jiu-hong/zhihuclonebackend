import express from "express";

import {
  signin,
  signup,
  forgot,
  reset,
  deleteUser,
} from "../controllers/user.js";

const route = express.Router();
route.post("/signin", signin);
route.post("/signup", signup);
route.post("/forgot", forgot);
route.post("/reset", reset);

//*************** for my test**********//
route.delete("/delete", deleteUser); //for my test
//*************** for my test**********//

export default route;
