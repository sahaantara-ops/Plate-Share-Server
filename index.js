const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors())
 

app.get('/', (req, res) => {
  res.send('Server is running fine')
})




const uri = "mongodb+srv://Plate-Share-Server:vwrkPxh6SRoD70LN@cluster0.tdrltck.mongodb.net/?appName=Cluster0";

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
   
    await client.connect();
    const db = client.db('Food-models')
    const foodCollection = db.collection('models')

     app.get('/models', async (req, res)=>{
     const result = await foodCollection.find().toArray()
     res.send(result)
  })

   app.post('/models', async (req, res)=>{
        const foodItem = req.body;
        console.log(foodItem)
        // const newItem = foodCollection.insertOne();
        res.send({
          success:true,
        })
   })






    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








app.listen(port, () => {
  console.log(`Server in listening on port ${port}`)
})
