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
    const myToysCollection = client.db('PliceToysDB').collection('myToys');    

    // Reading all toys 
    app.get('/toys', async (req, res) => {
        const result = await toysCollection.find().toArray();
        res.send(result)
    })    

    // Deleting MyToy using id
    app.delete('/myToys/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await myToysCollection.deleteOne(query);
      res.send(result)
    })
    
    // Updating MyToy by Id
    app.put('/mytoys/:id', async (req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true}
        const oldToy = req.body;
        const toy = {
          $set: {
            name: oldToy.name,
            quantity: oldToy.quantity,
            price: oldToy.price
          }
        }        
        const result = await myToysCollection.updateOne(filter, toy, options)
        res.send(result);
    })

    // Reading MyToy by Id
    app.get('/mytoys/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await myToysCollection.findOne(query)
        res.send(result);
    })

    // Reading Toy by Id
    app.get('/toys/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await toysCollection.findOne(query)
        res.send(result);
    })

    // Reading MyToy by email
    app.get('/myToys', async (req, res) => {
      let query = {}
      if(req.query.email){
        query = {userEmail: req.query.email}
      }
      const result = await myToysCollection.find(query).toArray()
      res.send(result)
    })

    // My Toy Routes (POST)
    app.post('/myToys', async (req, res) => {
        const newToy = req.body;
        const result = await myToysCollection.insertOne(newToy)
        res.send(result);
    })

    // Creating toys 
    app.post('/toys', async (req, res) => {
        const newToy = req.body;
        const result = await toysCollection.insertOne(newToy)
        res.send(result);
    })


    /*************************
     * TABS Data
     *************************/

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
    res.send('Police Toy Car (SERVER)')
})

app.listen(port, () => {
    console.log('Police Car Server Running on port -', port);
})