import jwt from "jsonwebtoken";
const secretToken = process.env.SECRET;

const verify = (req, res, next) => {
  console.log(req.body);
  next();
};

export default verify;
