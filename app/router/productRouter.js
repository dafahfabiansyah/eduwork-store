import express from 'express';
import { getProducts, getProductById, saveProduct, updateProduct, deleteProduct } from '../controller/productController.js';

const router = express.Router();

router.get('/api/products', getProducts);
router.get('/api/products/:id', getProductById);
router.post('/api/products/', saveProduct);
router.patch('/api/products/:id', updateProduct);
router.delete('/api/products/:id', deleteProduct);

export default router;
