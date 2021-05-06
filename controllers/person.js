import User from "../models/User.js";
import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import Comment from "../models/Comment.js";

export const followperson = async (req, res) => {
  try {
    const userid = req.userid;
    const { followid } = req.body;

    let { followings } = await User.findById(userid);
    let { followers } = await User.findById(followid);

    const alreadyFollowing = followings.find((f) => f == followid);

    if (alreadyFollowing) {
      followings = followings.filter((f) => f != followid); //type different so != insteadof !==

      //delete from followed user

      followers = followers.filter((f) => f != userid); //type different so != insteadof !==
    } else {
      followings.push(followid);
      //add to followed user

      followers.push(userid);
    }
    //update person
    const person = await User.findByIdAndUpdate(
      followid,
      { followers },
      { returnOriginal: false }
    )
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
      .populate({
        path: "followers",
        model: "User",
        select: ["name", "description"],
      })
      .populate({
        path: "followings",
        model: "User",
        select: ["name", "description"],
      });

    //update  user
    const user = await User.findByIdAndUpdate(
      userid,
      { followings },
      { returnOriginal: false }
    )
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
      .populate({
        path: "followers",
        model: "User",
        select: ["name", "description"],
      })
      .populate({
        path: "followings",
        model: "User",
        select: ["name", "description"],
      });

    res.status(200).json(person);
  } catch (error) {
    console.log("something wrong");
    res.status(400).json({ error: "something wrong" });
  }
};

export const getallforperson = async (req, res) => {
  const { personid } = req.body;

  // try {
  const person = await User.findById(personid);

  const ownanswers = await Answer.find({ creator: personid })
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

  const likeanswers = await Answer.find({ like: personid })
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

  //in likeanswers but not in ownanswers
  const diffanswers = likeanswers.filter(
    (answer) =>
      !ownanswers.find((a) => a._id.toString() === answer._id.toString())
  );

  const answers = [...ownanswers, ...diffanswers];

  const ownquestions = await Question.find({ creator: personid })
    .populate("topic")
    .populate("creator", ["name", "description"]);

  const followquestions = await Question.find({ follow: personid })
    .populate("topic")
    .populate("creator", ["name", "description"]);

  //in followquestions but not in ownquestions
  const diffquestions = followquestions.filter(
    (question) =>
      !ownquestions.find((q) => q._id.toString() === question._id.toString())
  );

  const questions = [...ownquestions, ...diffquestions];

  const personids = [...answers, ...questions].map(
    (element) => element.creator._id
  );

  const followersids = person.followers;
  const followingsids = person.followings;

  const uniquepersonids = [
    ...new Set([...personids, ...followersids, ...followingsids, personid]),
  ];

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

  const answerids = answers.map((answer) => answer._id);
  const questionids = questions.map((question) => question._id);

  const comments = await Comment.find({
    postid: [...answerids, ...questionids],
  }).populate("creator", ["name", "description"]);

  res.status(200).json({
    answers: answers,
    questions: questions,
    persons: persons,
    comments: comments,
  });
  // } catch (error) {
  //   res.status(400).json(error.message);
  // }
};

//****for my test****** */
export const deleteUser = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await User.findOneAndRemove({ email });
    res.status(200).json({
      result,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const allperson = async (req, res) => {
  const result = await User.find();
  res.status(200).json(result);
};
