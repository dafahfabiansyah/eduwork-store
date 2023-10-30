import express from 'express';
import mongoose from 'mongoose';
import { Product } from '../models/productModel.js';
import multer from 'multer';
import { policyCheck } from '../utils/token/decodeToken.js';

const router = express.Router();

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/product/image'); // Simpan gambar di direktori "uploads"
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// create
router.post('/', upload.single('image'), policyCheck('create', 'Product'), async (req, res) => {
  try {
    if (!req.body.name || !req.body.description || !req.body.price) {
      return res.status(400).send({
        message: 'send all required fields: name, description, price',
      });
    }

    const categoryId = new mongoose.Types.ObjectId(req.body.categoryId);
    const tagId = new mongoose.Types.ObjectId(req.body.tagId);
    const newProduct = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: req.file.filename,
      category: categoryId,
      tags: tagId,
    };

    const product = await Product.create(newProduct);

    return res.status(201).send(product);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// read
router.get('/', async (req, res) => {
  try {
    // Membaca query parameters dari URL
    const { page = 1, limit = 10 } = req.query;

    // Menghitung jumlah total produk (opsional)
    const totalProducts = await Product.countDocuments();

    // Mengambil produk dengan pembatasan (pagination)
    const products = await Product.find({})
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return res.status(200).json({
      count: totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      data: products,
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
    const product = await Product.findById(id).populate('category');
    return res.status(200).json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// update
router.put('/:id', upload.single('image'), policyCheck('update', 'Product'), async (req, res) => {
  try {
    if (!req.body.name || !req.body.description || !req.body.price)
      return res.status(400).send({
        message: 'send all required fields: name, description, price',
      });
    const { id } = req.params;
    const result = await Product.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res.status(404).json({ message: 'Products Not Found' });
    }
    return res.status(200).json({ message: 'Products Successfully Updated' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// delete
router.delete('/:id', policyCheck('delete', 'Product'), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Products Not Found' });
    }
    return res.status(200).json({ message: 'Products Successfully Deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

export default router;
