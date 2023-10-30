import mongoose from 'mongoose';
import express from 'express';
import { Order } from '../models/orderModel';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    return res.status(201).send(order);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
