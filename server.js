import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import compression from "compression";
import helmet from "helmet";

import questionroute from "./routes/questionroute.js";
import answerroute from "./routes/answerroute.js";
import userroute from "./routes/userroute.js";
import personroute from "./routes/personroute.js";
import commentroute from "./routes/commentroute.js";
import topicroute from "./routes/topicroute.js";
import searchroute from "./routes/searchroute.js";
import { auth } from "./middleware/auth.js";

const app = express();
app.use(compression());
app.use(helmet());

dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());

app.use("/question", questionroute);
app.use("/answer", answerroute);
app.use("/user", userroute);
app.use("/person", personroute);
app.use("/comment", commentroute);
app.use("/topics", topicroute);
app.use("/auth", auth);
app.use("/search", searchroute);
app.get("/", (req, res) => {
  res.send("Welcome from zhihuclone backend!");
});

mongoose
  .connect(process.env.DB_HOST_PROD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server is running on ${process.env.PORT}.`)
    );
  })
  .catch((err) => console.log(err.message));
