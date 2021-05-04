import Answer from "../models/Answer.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

// get
// [
//   {
//       "like": [],
//       "update_date": "2021-04-21T14:32:59.842Z",
//       "_id": "608037c24d701360c2e162a7",
//       "question_content": "question_content",
//       "content": "content111",
//       "creator_id": "creator_id",
//       "creator_name": "creator_name",
//       "creater_description": "creater_description111",
//       "__v": 0
//   }
// ]

export const getAnswers = async (req, res) => {
  try {
    const result = await Answer.find()
      .populate("topic")
      .populate({
        path: "creator",
        model: "User",
        select: ["name", "description"],
        populate: {
          path: "followers",
          model: "User",
          select: ["name", "description"],
        },
      })
      .populate("question");

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ err: error.message });
  }
};

export const getAnswersbyCreator = async (req, res) => {
  const { creator } = req.params;

  try {
    const result = await Answer.find({ creator })
      .populate("topic")
      .populate({
        path: "creator",
        model: "User",
        select: ["name", "description"],
        populate: {
          path: "followers",
          model: "User",
          select: ["name", "description"],
        },
      })
      .populate("question");

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const getAnswersbyLike = async (req, res) => {
  const { likeid } = req.params;

  try {
    const result = await Answer.find({ like: likeid })
      .populate("topic")
      .populate({
        path: "creator",
        model: "User",
        select: ["name", "description"],
        populate: {
          path: "followers",
          model: "User",
          select: ["name", "description"],
        },
      })
      .populate("question");

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const getAnswersbyTopic = async (req, res) => {
  const { topicid } = req.params;

  try {
    const result = await Answer.find({ topic: topicid })
      .populate("topic")
      .populate({
        path: "creator",
        model: "User",
        select: ["name", "description"],
        populate: {
          path: "followers",
          model: "User",
          select: ["name", "description"],
        },
      })
      .populate("question");

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const getCertainAnswers = async (req, res) => {
  const { questionid } = req.params;

  try {
    const result = await Answer.find({ question: questionid })
      .populate("topic")
      .populate({
        path: "creator",
        model: "User",
        select: ["name", "description"],
        populate: {
          path: "followers",
          model: "User",
          select: ["name", "description"],
        },
      })
      .populate("question");

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const getAnswer = async (req, res) => {
  const { answerid } = req.params;

  try {
    const result = await Answer.findById(answerid)
      .populate("topic")
      .populate({
        path: "creator",
        model: "User",
        select: ["name", "description"],
        populate: {
          path: "followers",
          model: "User",
          select: ["name", "description"],
        },
      })
      .populate("question");

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
// {
//   "question":"60818321b217b7098b2b7582",
//   "content":"content111",
//   "like":[],
// }

export const createAnswer = async (req, res) => {
  const { questionid } = req.params;
  const userid = req.userid;

  try {
    const body = req.body;

    const answer = new Answer({
      ...body,
      question: questionid,
      creator: userid,
      update_date: Date.now(),
    });

    const result = await (await Answer.create(answer))
      .populate("topic")
      .populate({
        path: "creator",
        model: "User",
        select: ["name", "description"],
        populate: {
          path: "followers",
          model: "User",
          select: ["name", "description"],
        },
      })
      .populate("question")
      .execPopulate();

    //add answer to user
    const { myanswers } = await User.findById(userid);
    myanswers.push(result._id);
    await User.findByIdAndUpdate(userid, { myanswers });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const updateAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    // {
    //     "content": "content111"
    //   }
    const updateResult = await Answer.findByIdAndUpdate(
      id,
      {
        content,
        update_date: new Date(),
      },
      {
        returnOriginal: false,
      }
    )
      .populate("topic")
      .populate({
        path: "creator",
        model: "User",
        select: ["name", "description"],
        populate: {
          path: "followers",
          model: "User",
          select: ["name", "description"],
        },
      })
      .populate("question");

    res.status(200).json(updateResult);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const likeAnswer = async (req, res) => {
  const answerid = req.params.id;
  const { userid } = req;

  let { like } = await Answer.findById(answerid);
  let { likeanswers } = await User.findById(userid);

  const alreadyLike = like.length > 0 ? like.find((e) => e == userid) : null;

  if (alreadyLike) {
    like = like.filter((e) => e !== userid);

    //delete answer from user
    likeanswers = likeanswers.filter((likeanswer) => likeanswer != answerid);
  } else {
    like.push(userid);

    //add answer to user
    likeanswers.push(answerid);
  }

  await User.findByIdAndUpdate(userid, { likeanswers });

  const newAnswer = await Answer.findByIdAndUpdate(
    answerid,
    { like },
    { returnOriginal: false }
  )
    .populate("topic")
    .populate("question")
    .populate({
      path: "creator",
      model: "User",
      select: ["name", "description"],
      populate: {
        path: "followers",
        model: "User",
        select: ["name", "description"],
      },
    });

  res.status(200).json(newAnswer);
};

export const deleteAnswer = async (req, res) => {
  const userid = req.userid;

  try {
    const { id } = req.params;

    const result = await Answer.findByIdAndRemove(id);

    if (!result) {
      return res.status(400).json({ error: "Answer cannot be found" });
    }

    /*******delete related comments*******/
    await Comment.deleteMany({ postid: id });
    /*******delete related comments*******/

    /*******delete answer from user*******/
    let { myanswers } = await User.findById(userid);

    myanswers = myanswers.filter((myanswer) => myanswer !== result._id);
    await User.findByIdAndUpdate(userid, { myanswers });
    /*******delete answer from user*******/

    /*******update each user in like array*******/
    const users = result.like;

    const func = async (user) => {
      let { likeanswers } = await User.findById(user);
      likeanswers = likeanswers.filter((u) => u !== id);
      await User.findByIdAndUpdate(user, { likeanswers });
    };
    if (users.length > 0) {
      users.forEach((user) => func(user));
    }
    /*******update each user in like array*******/

    res.status(200).json({ message: "Delete successfully" });
  } catch (error) {
    res.status(400).json(error);
  }
};
