import express from 'express';
import client from './database/mongo.js'
import cors from 'cors'

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(cors())

app.post('/login', async(req, res) => {
  try {
    const collection = await client.db('users').collection('clients');
    const docs = await collection.find({ email: req.body.email }).toArray();

    if (docs.length === 0) return res.send({ status: 404, message: 'No user found with that email' });
    
    if (docs[0]["password"] != req.body.password) return res.send({ status: 401, message: 'Incorrect password. '})

    return res.send({ status: 200, message: docs[0] })

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
})

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