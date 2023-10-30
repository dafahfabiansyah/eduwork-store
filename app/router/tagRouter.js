import express from 'express';
import { Tag } from '../models/tagModel.js';
import { policyCheck } from '../utils/token/decodeToken.js';

const router = express.Router();

// create
router.post('/', policyCheck('create', 'Tag'), async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).send({
        message: 'send all required fields: name',
      });
    }
    // const tagId = new mongoose.Types.ObjectId(req.body.tagId);
    const newTag = {
      name: req.body.name,
    };

    const tag = await Tag.create(newTag);
    return res.status(201).send(tag);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
// read
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find({});
    return res.status(200).json({
      count: tags.length,
      data: tags,
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
    const tag = await Tag.findById(id);
    return res.status(200).json(tag);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// update
router.put('/:id', policyCheck('update', 'Tag'), async (req, res) => {
  try {
    if (!req.body.name)
      return res.status(400).send({
        message: 'send all required fields: name',
      });
    const { id } = req.params;
    const result = await Tag.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res.status(404).json({ message: 'Tags Not Found' });
    }
    return res.status(200).json({ message: 'Tags Successfully Updated' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// delete
router.delete('/:id', policyCheck('delete', 'Tag'), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Tag.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Tags Not Found' });
    }
    return res.status(200).json({ message: 'Tags Successfully Deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

export default router;
