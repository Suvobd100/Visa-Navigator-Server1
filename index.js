const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
// app.use(cors({
//   // origin: ["http://localhost:5173", "https://coffee-store-4439e.web.app"],
//   origin: ["https://visa-navigator-9458a.web.app"],
//   credentials: true,
// }));
app.use(express.json());

// db server con with authentication
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8qsyw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    serverSelectionTimeoutMS: 50000,
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
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

    app.post("/visa", async (req, res) => {
      const newVisa = req.body;
      console.log("Adding new visa", newVisa);

      const result = await visasCollection.insertOne(newVisa);
      res.send(result);
    });

    // visas  Info id update
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

    // new by email
    // visas  Info id update
    // app.put("/visa", async (req, res) => {
    //   const email = req.body.email;
    //   const filter = { email };
    //   const options = { upsert: true };
    //   const updatedDoc = {
    //     $set: req.body,
    //   };
    //   const result = await visasCollection.updateOne(
    //     filter,
    //     updatedDoc,
    //     options
    //   );
    //   res.send(result);

    // });

    app.patch("/visas", async (req, res) => {
      const email = req.body.email;
      const filter = { email }; // Filter by email

      // Define the fields to update
      const updatedDoc = {
        $set: {
          lastSignInTime: req.body?.lastSignInTime, // Update lastSignInTime
          name: req.body?.name, // Update name
          photo: req.body?.photo, // Update photo
          visaType: req.body?.visaType, // Update visaType
          processingTime: req.body?.processingTime, // Update processingTime
          fee: req.body?.fee, // Update fee
          validity: req.body?.validity, // Update validity
        },
      };

      try {
        // Update the document in the database
        const result = await visasCollection.updateOne(filter, updatedDoc);

        if (result.modifiedCount > 0) {
          res
            .status(200)
            .send({ message: "Visa updated successfully", result });
        } else {
          res
            .status(404)
            .send({ message: "No visa found with the provided email" });
        }
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Delete
    app.delete("/visa/:id", async (req, res) => {
      console.log("going to delete", req.params.id);
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await visasCollection.deleteOne(query);
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
