import express from 'express';
import { Category } from '../models/categoryModel.js';
import { policyCheck } from '../utils/token/decodeToken.js';

const router = express.Router();

// create
router.post('/', policyCheck('create', 'Category'), async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).send({
        message: 'send all required fields: name',
      });
    }

    const newCategory = {
      name: req.body.name,
    };

    const category = await Category.create(newCategory);
    return res.status(201).send(category);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
// read
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.status(200).json({
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// read by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    return res.status(200).json(category);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// update
router.put('/:id', policyCheck('update', 'Category'), async (req, res) => {
  try {
    if (!req.body.name)
      return res.status(400).send({
        message: 'send all required fields: name',
      });
    const { id } = req.params;
    const result = await Category.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res.status(404).json({ message: 'Categories Not Found' });
    }
    return res.status(200).json({ message: 'Categories Successfully Updated' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// delete
router.delete('/:id', policyCheck('delete', 'Category'), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Category.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Categories Not Found' });
    }
    return res.status(200).json({ message: 'Categories Successfully Deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

export default router;
