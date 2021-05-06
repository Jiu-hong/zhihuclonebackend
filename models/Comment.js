import mongoose from "mongoose";
const { Schema } = mongoose;

// comment:
// 1, answer_id/ question_id
// 2, content
// 3, update_date

const CommentSchema = new Schema({
  postid: String, //this can be questionid, answerid
  parentid: String, //this is commentid to response
  content: String,
  content_lower: String,
  like: [String],
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  // update_date: { type: Date, default: new Date() },
  update_date: { type: Date, default: Date.now() },
});

export default mongoose.model("Comment", CommentSchema);
