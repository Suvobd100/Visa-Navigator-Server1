const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://visaMaster:o7xT8XoGJj6Vc0Vz@cluster0.8qsyw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
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

// add new visa post
    app.post("/visa", async (req, res) => {
      const newVisa = req.body;
      console.log("Adding new visa", newVisa);

      const result = await visasCollection.insertOne(newVisa);
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

app.listen(port,()=>{
    console.log(`App Server Exam running port ${port}`);
})
