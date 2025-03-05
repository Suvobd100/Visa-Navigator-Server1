const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// db server con with authentication
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8qsyw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // create db & collection for visa
    const database = client.db("visaDB");
    // const coffeeCollection = database.collection('coffee');
    const visasCollection = database.collection("visas");

    // get all data from DB to show Frontend that for crete API Backend
    app.get("/visas", async (req, res) => {
      const cursor = visasCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // add new visa post
    // app.post("/visa", async (req, res) => {
    //   const newVisa = req.body;
    //   console.log("Adding new visa", newVisa);

    //   const result = await visasCollection.insertOne(newVisa);
    //   res.send(result);
    // });

    // visas  Info update
    app.put("/visa/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: req.body,
      };
      const result = await visasCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("App Server r7  Exam running......");
});

app.listen(port, () => {
  console.log(`App Server Exam running port ${port}`);
});
