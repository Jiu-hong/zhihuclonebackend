import mongoose from "mongoose";
const { Schema } = mongoose;

const TopicSchema = new Schema({
  name: String,
  description: String,
});

export default mongoose.model("Topic", TopicSchema);
