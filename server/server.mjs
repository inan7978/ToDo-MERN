import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
import mongodb from "mongodb";
import express from "express";
const app = express();

app.use(express.json({ extended: true }));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

const port = 3002;

const uri =
  "mongodb+srv://admin:Gp96g3TN2ipProJA@cluster0.cfjceuu.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);
await client.connect();
const dbName = "myDatabase";
const collectionName = "myTasks";

const database = client.db(dbName);

app.get("/", async (req, res) => {
  const collection = database.collection(collectionName);
  const items = await collection.find({}).toArray();
  console.log("Fetch request made.");
  res.send(items).status(200);
});

app.post("/", async (req, res) => {
  const collection = await database.collection(collectionName);
  const result = await collection.insertOne(req.body);
  res.send(result).status(204);
});

app.delete(`/:id`, async (req, res) => {
  console.log(`Delete request for task: ${req.params.id}`);
  const collection = database.collection(collectionName);
  const result = await collection.deleteOne({
    _id: new mongodb.ObjectId(`${req.params.id}`),
  });
});

app.patch("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const updates = {
    $set: {
      task: req.body.task,
      completed: req.body.completed,
    },
  };

  let collection = await database.collection(collectionName);
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

app.listen(port, () => {
  console.log(`to-to-fullstack server listening on port ${port}...`);
});
