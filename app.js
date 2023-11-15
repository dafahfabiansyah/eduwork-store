import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import { PORT, MongoDBURL } from './config.js';
import productRouter from './app/router/productRouter.js';
import categoriesRouter from './app/router/categoryRouter.js';
import tagRouter from './app/router/tagRouter.js';
import authRouter from './app/auth/authRouter.js';
import addressRouter from './app/router/addressRouter.js';
import cartRouter from './app/router/cartRouter.js';
import cors from 'cors';
import { decodeToken } from './app/utils/token/decodeToken.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({ type: 'text/html' }));
app.use(fileUpload());
app.use(express.static('public'));
app.get('/', (req, res) => {
  console.log(req);
  return res.status(234).send('Eduwork API Service');
});

app.use(productRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/tags', tagRouter);
app.use('/address', addressRouter);
// .....
app.use('/carts', cartRouter);
app.use('/auth', authRouter);
// app.use(decodeToken());

mongoose
  .connect(MongoDBURL)
  .then(() => {
    console.log('Connected to DB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting db', error);
  });
