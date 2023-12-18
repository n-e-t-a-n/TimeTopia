import { MongoClient, ServerApiVersion } from 'mongodb'
import 'dotenv/config'

const uri = 
"mongodb+srv://" + 
process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + 
"@timetopia.t10971p.mongodb.net/?retryWrites=true&w=majority";

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
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    await client.close()
    console.log(error)
  }
}
run().catch(console.dir);

export default client;