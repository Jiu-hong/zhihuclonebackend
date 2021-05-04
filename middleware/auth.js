import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedData = jwt.verify(token, "test");

    req.userid = decodedData.id;

    next();
    // res.status(200).json(decodedData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
