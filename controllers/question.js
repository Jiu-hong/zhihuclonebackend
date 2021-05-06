import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

export const getQuestions = async (req, res) => {
  try {
    const result = await Question.find()
      .populate("topic")
      .populate("creator", ["name", "description"]);
    res.status(200).json(result); //[]
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCertainQuestion = async (req, res) => {
  const { questionid } = req.params;

  const question = await Question.findById(questionid)
    .populate("topic")
    .populate("creator", ["name", "description"]);

  const answers = await Answer.find({ question: questionid })
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

  let personids = answers.map((answer) => answer.creator._id);

  personids.push(question.creator._id);
  const uniquepersonids = [...new Set(personids)];

  // const persons = await User.find({ _id: { $in: uniquepersonids } })
  const persons = await User.find({ _id: uniquepersonids })
    .select("-password")
    .populate({
      path: "myquestions",
      model: "Question",
      populate: {
        path: "creator",
        model: "User",
        select: ["email", "description", "name"],
      },
    })
    .populate({
      path: "myanswers",
      model: "Answer",
      populate: [
        {
          path: "creator",
          select: ["email", "description", "name"],
          model: "User",
        },
        {
          path: "question",
          model: "Question",
        },
      ],
    })
    .populate({
      path: "followquestions",
      model: "Question",
      populate: {
        path: "creator",
        model: "User",
        select: ["email", "description", "name"],
      },
    })
    .populate({
      path: "likeanswers",
      model: "Answer",
      populate: [
        {
          path: "creator",
          select: ["email", "description", "name"],
          model: "User",
        },
        {
          path: "question",
          model: "Question",
        },
      ],
    })
    // .populate("followers")
    .populate({
      path: "followers",
      model: "User",
      select: ["name", "description"],
    })
    // .populate("followings");
    .populate({
      path: "followings",
      model: "User",
      select: ["name", "description"],
    });

  const qandasids = answers.map((answer) => answer._id);
  qandasids.push(questionid);

  const comments = await Comment.find({ postid: qandasids }).populate(
    "creator",
    ["name", "description"]
  );

  res.status(200).json({ question, answers, persons, comments });
};

export const createQuestion = async (req, res) => {
  const body = req.body;
  const userid = req.userid;

  try {
    const newQuestion = new Question({
      ...body,
      content_lower: body.content.toLowerCase(),
      creator: userid,
      update_date: Date.now(),
    });

    const result = await (await newQuestion.save())
      .populate("topic")
      .populate("creator", ["name", "description"])
      .execPopulate();

    //add to user myquestions
    let { myquestions } = await User.findById(userid);
    myquestions.push(result._id);
    await User.findByIdAndUpdate(userid, { myquestions });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// {
//     "content":"content111222",
//   }

export const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const updateResult = await Question.findByIdAndUpdate(
      id,
      { content },
      { returnOriginal: false }
    )
      .populate("topic")
      .populate("creator", ["name", "description"]);

    res.status(200).json(updateResult);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const followQuestion = async (req, res) => {
  const questionid = req.params.id;
  const { userid } = req;
  try {
    let { follow } = await Question.findById(questionid);
    let { followquestions } = await User.findById(userid);

    const alreadyFollow =
      follow.length > 0 ? follow.find((e) => e == userid) : null;

    if (!alreadyFollow) {
      follow.push(userid);

      //add to user followquestions

      followquestions.push(questionid);
    } else {
      follow = follow.filter((e) => e !== userid);

      //delete from user followquestions

      followquestions = followquestions.filter(
        (followquestion) => followquestion != questionid
      );
    }

    await User.findByIdAndUpdate(userid, { followquestions });
    const result = await Question.findByIdAndUpdate(
      questionid,
      { follow },
      { returnOriginal: false }
    )
      .populate("topic")
      .populate("creator", ["name", "description"]);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  const userid = req.userid;

  // try {
  const result = await Question.findByIdAndRemove(id);

  if (!result) {
    return res.status(400).json({ error: "Question cannot be found" });
  }

  /*******delete related answers*******/
  await Answer.deleteMany({ question: id });
  /*******delete related answers*******/

  /*******delete related comments*******/
  await Comment.deleteMany({ postid: id });
  /*******delete related comments*******/

  /*******delete question from user*******/
  let { myquestions } = await User.findById(userid);

  myquestions = myquestions.filter((myquestion) => myquestion != id);

  await User.findByIdAndUpdate(userid, { myquestions });
  /*******delete question from user*******/

  /*******update each user in follow array*******/
  const users = result.follow;

  const func = async (user) => {
    let { followquestions } = await User.findById(user);
    followquestions = followquestions.filter((u) => u != id);
    await User.findByIdAndUpdate(user, { followquestions });
  };
  if (users.length > 0) {
    users.forEach((user) => func(user));
  }
  /*******update each user in follow array*******/

  res.status(200).json({ message: "Delete successfully" });
  // } catch (error) {
  //   res.status(400).json({ error: error.message });
  // }
};
