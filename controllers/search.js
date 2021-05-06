import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import Topic from "../models/Topic.js";

export const getAll = async (req, res) => {
  const { searchcontent } = req.body;
  if (!searchcontent) return;
  console.log("searchcontent:", searchcontent);

  // try {
  const questions = await Question.find({
    content_lower: { $regex: searchcontent, $options: "i" },
  })
    .populate("topic")
    .populate("creator", ["name", "description"]);

  const answers = await Answer.find({
    content_lower: { $regex: searchcontent, $options: "i" },
  })

    .populate("question")
    .populate("topic")
    .populate("creator", ["name", "description"]);

  const users = await User.find({
    name_lower: { $regex: searchcontent, $options: "i" },
  }).select("-password");

  const comments = await Comment.find({
    content_lower: { $regex: searchcontent, $options: "i" },
  })
  .populate("creator", ["name_lower", "description"]);

  const topics = await Topic.find({
    name_lower: { $regex: searchcontent, $options: "i" },
  });

  res
    .status(200)
    .json([...questions, ...answers, ...users, ...comments, ...topics]); //
  // } catch (error) {
  //   res.status(400).json({ error: error.message });
  // }
};
