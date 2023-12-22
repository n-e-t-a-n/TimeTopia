import express from 'express';
import client from './database/mongo.js'
import cors from 'cors'

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(cors({ 
  origin: ["http://localhost:5173"], 
  credentials: true 
}))

app.post('/login', async(req, res) => {
  try {
    const collection = await client.db('timetopia').collection('users');
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
    const collection = await client.db('timetopia').collection('users');

    const accountExists = await collection.findOne({ "email": req.body.email });
    const usernameExists = await collection.findOne({ "username": req.body.username });

    if (accountExists) return res.send({ status: 409, message: 'That email is already in use.' });

    if (usernameExists) return res.send({ status: 409, message: 'An account with that username already exists.' });

    const user = { ...req.body }
    const result = await collection.insertOne({ ...user, schedules:[] });

    if (result["acknowledged"] === true) return res.status(201).json({ status: 201, message: { ...user, schedules:[] }});
    
    return res.status(500).json({ status: 500, message: 'Failed to create the account' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

app.listen(port ,()=>{
    console.log(`Express server is running at http://localhost:${port}`)
});