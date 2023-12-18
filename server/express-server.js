import express from 'express';
import client from './database/mongo.js'

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())

app.get('/', async (_, res) => {
    try {
      const collection = await client.db('sample_analytics').collection('customers');
      const docs = await collection.find({  });
  
      if (docs.length === 0) {
        res.send({ message: 'No customer found with that username' });
      } else {
        res.send({ docs });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error' });
    }
  });

  app.post('/clients', async (req, res) => {
    try {
      const { username, name, email, ...additionalData } = req.body;
      const collection = await client.db('users').collection('clients');
  
      const newClient = {
        username,
        name,
        email,
        ...additionalData
      };
  
      const result = await collection.insertOne(newClient);
  
      if (result.acknowledged) {
        res.status(201).send({ message: 'Client created successfully!' });
      } else {
        throw new Error('Failed to create client.'); // Handle the error appropriately
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error.' });
    }
  });

app.listen( port ,()=>{
    console.log('server is running at port number 3000')
});