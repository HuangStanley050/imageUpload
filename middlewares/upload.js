/*
investigate the issue of

https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client


 */
// resolved by adding 'return' after line 15

//task done
//1 can save to cloud
//2 can get the signed url
//3 needs to save to mongodb Post collection
//4 return the result to client with filename and download url

import Post from "../models/post";
import User from "../models/user";
import mongoose from "mongoose";

const upload = async (req, res, next) => {
  const bucket = req.app.get("bucket");
  const options = {
    version: "v2", // defaults to 'v2' if missing.
    action: "read",
    expires: Date.now() + 1000 * 60 * 60 // one hour
  };

  if (!req.file) {
    const error = new Error("no file attached");
    next(error);
    return;
  }
  const blob = bucket.file(req.file.originalname);
  const fileName = req.file.originalname;
  const [url] = await blob.getSignedUrl(options);
  const userId = res.locals.userId;
  const blobStream = blob.createWriteStream({
    metadata: {metadata: {PoserId: userId}}
  });

  blobStream.on("error", err => {
    next(err);
    return;
  });

  blobStream.on("finish", async () => {
    //console.log(res.locals.userId);
    const newPost = Post({
      fileName,
      userId
    });
    let successfulPost = await newPost.save();
    let user = await User.findById(mongoose.Types.ObjectId(userId));
    user.posts.push(successfulPost.id);
    await user.save();
    res.status(200).json({fileName: fileName, download: url});
    return;
  });

  blobStream.end(req.file.buffer);
};

export default upload;
