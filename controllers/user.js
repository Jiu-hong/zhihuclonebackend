import User from "../models/User.js";
import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import Comment from "../models/Comment.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export const signin = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser)
    return res.status(400).json({ error: "User doesn't exists." });

  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password
  );

  if (!isPasswordCorrect)
    return res.status(400).json({ error: "Invalid credentials" });

  const existingUserWithoutPwd = {
    _id: existingUser._id,
    name: existingUser.name,
    description: existingUser.description,
    email: existingUser.email,
  };

  const token = jwt.sign(
    { result: existingUserWithoutPwd, id: existingUserWithoutPwd._id },
    "test",
    { expiresIn: "1h" }
  );

  res.status(200).json({ result: existingUserWithoutPwd, token });
};

export const signup = async (req, res) => {
  const {
    email,
    password,
    confirmpassword,
    firstname,
    lastname,
    description,
  } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser)
    return res.status(400).json({ error: "User already exists" });

  if (password !== confirmpassword) {
    return res.status(400).json({ error: "Passwords don't match." });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    email,
    password: hashedPassword,
    name: `${firstname} ${lastname}`,
    name_lower: `${firstname} ${lastname}`.toLowerCase(),
    description,
  });

  const result = await user.save();

  const userWithoutPwd = {
    _id: result._id,
    name: result.name,
    description: result.description,
    email: result.email,
  };

  const token = jwt.sign(
    { result: userWithoutPwd, id: userWithoutPwd._id },
    "test",
    {
      expiresIn: "1h",
    }
  );

  res.status(200).json({ result: userWithoutPwd, token });
};

const transporter = nodemailer.createTransport({
  service: process.env.NODEMAILER_SERVICE, // no need to set host or port etc.
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

let mailOptions = {
  from: process.env.NODEMAILER_FROM,
  to: process.env.NODEMAILER_TO,
  subject: "zhihuclone password reset",
  text: "It works",
};

export const forgot = async (req, res) => {
  try {
    const { email } = req.body;

    const token = (await crypto.randomBytes(20)).toString("hex");

    const result = await User.findOneAndUpdate(
      { email },
      {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000, // 1 hour
      },
      { returnOriginal: false }
    );
    if (!result) return res.status(400).json({ error: "User does't exist." });

    mailOptions = {
      ...mailOptions,
      to: result.email,
      text: `Please click the following link to reset the password. If the request is not sent by you please ignore it.
  http://localhost:3000/reset/${token}



  Regards. zhihuclone team
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message:
        "A link has been sent to your email box, please check your email box to reset the password",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const reset = async (req, res) => {
  const { randamtoken, email, password, confirmPassword } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser)
    return res.status(400).json({ error: "User doesn't exists." });

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords don't match." });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await User.findOneAndUpdate(
    {
      email,
      resetPasswordToken: randamtoken,
      resetPasswordExpires: { $gt: Date.now() },
    },
    { password: hashedPassword },
    { returnOriginal: false }
  );

  if (!result) {
    return res
      .status(400)
      .json({ error: "The reset password time has run out." });
  }

  const userWithoutPwd = {
    _id: result._id,
    name: result.name,
    description: result.description,
    email: result.email,
  };

  const token = jwt.sign(
    { result: userWithoutPwd, id: userWithoutPwd._id },
    "test",
    {
      expiresIn: "1h",
    }
  );

  res.status(200).json({ result: userWithoutPwd, token });
};

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
    //update followed user
    const result = await User.findByIdAndUpdate(
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
      .populate("followers")
      .populate("followings");

    //update current user
    await User.findByIdAndUpdate(userid, { followings });

    res.status(200).json(result);
  } catch (error) {
    console.log("something wrong");
    res.status(400).json({ error: "something wrong" });
  }
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

//*********for my test *******/
