import mongoose from "mongoose";
const { Schema } = mongoose;
// answer:
// 2, question_id
// 3, question_content
// 3, content
// 4, like
// 6, creator_id
// 6, creator_name
// 7, create_description
// 8, update_date

const AnswerScheme = new Schema({
  // question_id:
  question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  content: String,
  topic: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
  like: [String],
  anonymous: { type: Boolean, default: false },
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  update_date: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("Answer", AnswerScheme);
