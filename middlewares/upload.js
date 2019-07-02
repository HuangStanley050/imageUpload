const upload = (req, res, next) => {
  const bucket = req.app.get("bucket");
  console.log(bucket);
  if (!req.file) {
    const error = new Error("no file attached");
    next(error);
  }
  res.json({ message: "all good" });
};

export default upload;
