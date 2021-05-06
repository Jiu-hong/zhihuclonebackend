import Comment from "../models/Comment.js";

export const getAllComments = async (req, res) => {
  const result = await Comment.find().populate("creator", [
    "name",
    "description",
  ]);

  res.status(200).json(result);
};

//route.get("/:parent_id", getCertainComments);
export const getCertainComments = async (req, res) => {
  const { postid } = req.params;
  try {
    const result = await Comment.find({
      postid,
    }).populate("creator", ["name", "description"]);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//route.post("/:parent_id/", createComment);
//http://localhost:5005/comment/:parent_id
//input:
// {
//   "parentType":"comment"
//   'content':"",
//   "like":[],
//   "reply":[]
// }
export const createComment = async (req, res) => {
  const { postid } = req.params;
  const { parentid, content, like } = req.body;

  let commentcontent;
  if (parentid) {
    commentcontent = new Comment({
      postid,
      parentid,
      content,
      content_lower: content.toLowerCase(),
      like,
      creator: req.userid,
      update_date: Date.now(),
    });
  } else {
    commentcontent = new Comment({
      postid,
      //no parentid
      content,
      content_lower: content.toLowerCase(),
      like,
      creator: req.userid,
      update_date: Date.now(),
    });
  }

  try {
    const newComment = await (await commentcontent.save())
      .populate("creator", ["name", "description"])
      .execPopulate();

    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//route.patch("/:commentid", updateComment);
export const updateComment = async (req, res) => {
  const { commentid } = req.params;
  const { content } = req.body;

  try {
    const updateResult = await Comment.findByIdAndUpdate(
      commentid,
      { content },
      { returnOriginal: false }
    ).populate("creator", ["name", "description"]);

    res.status(200).json(updateResult);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//route.patch("/like/:commentid", likeComment);
export const likeComment = async (req, res) => {
  const { commentid } = req.params;
  const userid = req.userid;

  try {
    let { like } = await Comment.findById(commentid);

    const alreadyLike = like.length > 0 ? like.find((e) => e == userid) : null;

    if (alreadyLike) {
      like = like.filter((e) => e !== userid);
    } else {
      like.push(userid);
    }

    const result = await Comment.findByIdAndUpdate(
      commentid,
      { like },
      { returnOriginal: false }
    ).populate("creator", ["name", "description"]);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//route.delete("/:commentid", deleteComment);
export const deleteComment = async (req, res) => {
  const { commentid } = req.params;

  try {
    /**delete the comment whose parentid is current commentid**/
    const func = async (id) => {
      const results = await Comment.find({ parentid: id });

      if (results.length > 0) {
        await Comment.deleteMany({ parentid: id });

        results.forEach((comment) => func(comment._id));
      }
    };
    await func(commentid);
    /**delete the comment whose parentid is this commentid**/

    //delete current comment
    const result = await Comment.findByIdAndRemove(commentid);

    if (!result) {
      return res.status(400).json({ error: "Comment cannot be found" });
    }

    res.status(200).json({ message: "Delete successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
