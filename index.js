const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// https://assignment-11-server-methubd.vercel.app

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.some2ew.mongodb.net/?retryWrites=true&w=majority`;

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

    const toysCollection = client.db('PliceToysDB').collection('toys');

    // Reading 'Ambulance' category
    app.get('/ambulance', async (req, res) => {
      const query = {subCategory: "Ambulance"}
      const result = await toysCollection.find(query).toArray()
      res.send(result);
    })

    // Reading 'SUV' category
    app.get('/suv', async (req, res) => {
      const query = {subCategory: "SUV"}
      const result = await toysCollection.find(query).toArray()
      res.send(result);
    })

    // Reading 'Truck' category
    app.get('/truck', async (req, res) => {
      const query = {subCategory: "Truck"}
      const result = await toysCollection.find(query).toArray()
      res.send(result);
    })

    // Reading all toys 
    app.get('/toys', async (req, res) => {
        const result = await toysCollection.find().toArray();
        res.send(result)
    })

    
    
    // Toy by Id 
    app.get('/toys/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await toysCollection.findOne(query)
        res.send(result);
    })

    // Creating toys 
    app.post('/toys', async (req, res) => {
        const newToy = req.body;
        const result = await toysCollection.insertOne(newToy)
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Mongo Connected!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Police Toy Car (SERVER !)')
})

app.listen(port, () => {
    console.log('Police Car Server Running on port -', port);
})