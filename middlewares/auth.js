import jwt from "jsonwebtoken";
const secretToken = process.env.SECRET;

const verify = (req, res, next) => {
  let decoded;
  let error;
  if (!req.headers.authorization) {
    error = new Error("No auth in header");
    next(error);
  }
  const token = req.headers.authorization.split(" ")[1];

  if (!token || token === "") {
    error = new Error("No token attached!");
    next(error);
  }
  try {
    decoded = jwt.verify(token, secretToken);
  } catch (error) {
    error = new Error("token decode failed!!");
    next(error);
  }
  if (!decoded) {
    error = new Error("Unable to authenticat with token");
    next(error);
  }
  console.log(decoded);
  res.locals.userId = decoded.userId;
  next();
};

export default verify;
