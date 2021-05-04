import Topic from "../models/Topic.js";

export const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find();
    res.status(200).json(topics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCertainTopic = async (req, res) => {
  try {
    const { topicid } = req.params;
    const topic = await Topic.findById(topicid);
    res.status(200).json(topic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCertainTopic = async (req, res) => {
  try {
    const { topicid } = req.params;

    const result = await Topic.findByIdAndRemove(topicid);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createTopic = async (req, res) => {
  try {
    const body = req.body;

    const topic = new Topic(body);
    const result = await topic.save();

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
