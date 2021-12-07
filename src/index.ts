import express, { Request, Response } from 'express';
import { URLcontroller } from './controllers/URLcontroller';
import { MongoConnection } from './database/MongoConnection';

// Set the project to use Express with Json
const api = express();
api.use(express.json());

// Set the project to use MongoDB
const database = new MongoConnection();
database.connect();

// Set the controller for each URL and its methods
const urlController = new URLcontroller();
api.post('/shorten', urlController.shorten);
api.get('/:hash', urlController.redirect);


// Get Express listening on port 5000
api.listen(5000, () => console.log('Express is up!'));