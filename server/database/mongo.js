import { MongoClient, ServerApiVersion } from 'mongodb'
import 'dotenv/config'

const uri = `mongodb+srv:// ${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@timetopia.t10971p.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    await client.close()
    console.log(error)
  }
}
run().catch(console.dir);

export default client;