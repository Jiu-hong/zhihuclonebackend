import mongoose from "mongoose";
const { Schema } = mongoose;

// question:
// 1, content
// 2, follow
// 3, like
// 4, update_date
// 5, creator_id

// {
//   "content":"questioncontent",
//   "follow":[],

// }
const QuestionSchema = mongoose.Schema({
  content: String,
  topic: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
  follow: [String],
  anonymous: { type: Boolean, default: false },
  // like: [String],
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  update_date: { type: Date, default: new Date() },
});

export default mongoose.model("Question", QuestionSchema);
