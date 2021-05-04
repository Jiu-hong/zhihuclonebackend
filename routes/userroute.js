import express from "express";

import {
  signin,
  signup,
  forgot,
  reset,
  deleteUser,
  getusers,
  getuserinfo,
  getusersbyids,
  followuser,
  clearuserinfo,
} from "../controllers/user.js";
import { auth } from "../middleware/auth.js";

const route = express.Router();
route.post("/signin", signin);
route.post("/signup", signup);
route.post("/forgot", forgot);
route.post("/reset", reset);
route.post("/getuser", getuserinfo);
route.post("/getusersbyids", getusersbyids);
route.post("/followuser", auth, followuser);
route.post("/clearuser", auth, clearuserinfo);
route.get("/", getusers);

//*************** for my test**********//
route.delete("/delete", deleteUser); //for my test
//*************** for my test**********//

export default route;
