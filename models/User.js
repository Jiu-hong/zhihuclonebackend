import mongoose from "mongoose";

const { Schema } = mongoose;

// User:
// 1,name
// 2,description
// 3,email
// 4,password,

const UserSchema = new Schema({
  name: String,
  name_lower: String,
  description: String,
  email: String,
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: String,

  myquestions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  myanswers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  followquestions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  likeanswers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  followings: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model("User", UserSchema);
