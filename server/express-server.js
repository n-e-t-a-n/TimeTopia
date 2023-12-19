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

app.post('/register', async (req, res) => {
  try {
    const collection = await client.db('users').collection('clients');
    const accountExists = await collection.findOne({ "email": req.body.email });

    if (accountExists) return res.send({ status: 409, message: 'An account with that email already exists.' });

    const user = { ...req.body }
    const result = await collection.insertOne(user);

    if (result["acknowledged"] === true) return res.status(201).json({ status: 201, message: "Account successfully created." });
    
    return res.status(500).json({ status: 500, message: 'Failed to create the account' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.listen(port ,()=>{
    console.log(`The server is running at http://localhost:${port}`)
});