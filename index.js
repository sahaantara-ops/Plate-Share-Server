const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const { MongoClient, ServerApiVersion, ObjectId, } = require('mongodb');

const admin = require("firebase-admin");

const serviceAccount = require("./servicekey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(cors())
 

app.get('/', (req, res) => {
  res.send('Server is running fine')
})


app.use(express.json());

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

   app.get('/models/:id', async (req, res)=>{
    
    const {id} = req.params
    console.log(id);
  
    const result = await foodCollection.findOne({ _id: new ObjectId(id) })    
    res.send({
      success:true,
      result
      
    })
   })
   
   app.put('/models/:id', async (req, res)=>{
    const {id} = req.params;
    console.log(req);
    const data = req.body;
    console.log(id);
    console.log(data);
    const objectId = new ObjectId(id);
    const filter = { _id: objectId };
    const update = {
      $set: data
    }
    console.log(update);
    const result = await foodCollection.updateOne(filter, update)
    console.log(result);
    res.send({
      success:true,
    
    })
    
   })     


    app.delete('/models/:id', async (req,res) =>{
      const {id} = req.params
    //   const objectId = new ObjectId(id);
    // const filter = { _id: objectId };
      const result = await foodCollection.deleteOne({ _id: new ObjectId(id) })

      res.send({
        success:true,
        result
      })
    })

    app.get('/latest-food' , async (req,res) =>{
      const result = await foodCollection.find()
      .sort({ ServedBy: -1 }) 
      .limit(6)
      .toArray();
      console.log(result)
      res.send(result)
    })
    

//    app.get('/availablefoods', async (req, res) => {
//   try {
//     const data = foodCollection.findOne({ food_status: Available });
//     const result = await data.toArray();
//     res.send({
//       success: true,
//       result
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ success: false, message: "Server Error" });
//   }
// });








   app.post('/models', async (req, res)=>{
        const foodItem = req.body;
        console.log(foodItem)
        const newItem = foodCollection.insertOne(foodItem);
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
