import express from "express";
import mongoose from "mongoose";
import * as admin from "firebase-admin";
import verify from "./middlewares/auth";
import upload from "./middlewares/upload";
import Multer from "multer";
import serviceAccount from "./graphql-gram-94075-firebase-adminsdk-ejim3-44c474bfe5.json";
import cors from "cors";

const port = process.env.PORT || 8000;
const connect_string = `mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@cluster0-cjli2.mongodb.net/graphqlGram?retryWrites=true&w=majority`;
const app = express();

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://dining-out-94075.appspot.com/"
});

const bucket = admin.storage().bucket();

app.set("bucket", bucket);
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

app.use("/api/upload", verify, multer.single("file"), upload);

app.use((req, res, next) => {
  console.log(err);
  res.status(404).send("Route not found");
});
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send("Something broke!");
});

mongoose
  .connect(
    connect_string,
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen(port, () => console.log("server running on port ", port));
  })
  .catch(err => console.log(err));
