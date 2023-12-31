import express from 'express';
import client from './database/mongo.js'

import bcrypt from 'bcrypt'
import cors from 'cors'

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(cors({ 
  origin: ["http://localhost:5173"], 
  credentials: true 
}))

const swaggerDefinition = {
  info: {
    title: 'TimeTopia API',
    version: '1.0.0',
    description: 'API documentation for TimeTopia application endpoints',
  },
  basePath: '/',
};

const options = {
  swaggerDefinition,
  apis: ['express-server.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     description: Use this endpoint when you want to get a session cookie for the website.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User credentials for login
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Incorrect password
 *       404:
 *         description: No user found with that email
 *       500:
 *         description: Internal server error
 */
app.post('/login', async(req, res) => {
  try {
    const collection = await client.db('timetopia').collection('users');
    const docs = await collection.find({ email: req.body.email }).toArray();

    if (docs.length === 0) return res.send({ status: 404, message: 'No user found with that email' });

    const isPasswordValid = await bcrypt.compare(req.body.password, docs[0]["password"]);

    if (!isPasswordValid) return res.send({ status: 401, message: 'Incorrect password. '})

    const { username, email, name } = docs[0]

    return res.send({ status: 200, message: { username, email, name } })

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
})

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Use this endpoint to save a new user's information in the database.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User details for registration
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             name:
 *               type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email or username already in use
 *       500:
 *         description: Internal server error
 */
app.post('/register', async (req, res) => {
  try {
    const collection = await client.db('timetopia').collection('users');

    const accountExists = await collection.findOne({ "email": req.body.email });
    const usernameExists = await collection.findOne({ "username": req.body.username });

    if (accountExists) {
      return res.status(409).json({ status: 409, message: 'That email is already in use.' });
    }

    if (usernameExists) {
      return res.status(409).json({ status: 409, message: 'An account with that username already exists.' });
    }

    const { password, ...user } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const result = await collection.insertOne({ ...user, password: hashed, schedules:[] });

    const { username, email, name } = user;

    if (result["acknowledged"] === true) return res.status(201).json({ status: 201, message: { username, email, name }});
    
    return res.status(500).json({ status: 500, message: 'Failed to create the account' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
});

app.listen(port ,()=>{
    console.log(`Express server is running at http://localhost:${port}`)
});