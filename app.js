import express from "express";
import mongoose from "mongoose";
import * as admin from "firebase-admin";
import verify from "./middlewares/auth";
import cors from "cors";

const port = process.env.PORT || 8000;
const connect_string = `mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@cluster0-cjli2.mongodb.net/graphqlGram?retryWrites=true&w=majority`;
const app = express();

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true}));
app.use("/api/upload", verify, (req, res, next) => {
  res.json({message: "Upload route"});
});

app.use((req, res, next) => {
  console.log(err);
  res.status(404).send("Route not found");
});
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send("Something broke!");
});

mongoose
  .connect(connect_string, {useNewUrlParser: true})
  .then(() => {
    app.listen(port, () => console.log("server running on port ", port));
  })
  .catch(err => console.log(err));
