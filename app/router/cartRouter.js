import express from 'express';
import { Cart } from '../models/cartItemsModel.js';
import { policyCheck } from '../utils/token/decodeToken.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const cart = await Cart.create(req.body);
    return res.status(201).send(cart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const cart = await Cart.find(req.body);
    return res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default router;
