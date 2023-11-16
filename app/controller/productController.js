import { Product } from '../models/productModel.js';
import { Category } from '../models/categoryModel.js';
import { Tag } from '../models/tagModel.js';
import path from 'path';
import fs from 'fs';
// import image from '../../public/image';

export const getProducts = async (req, res) => {
  try {
    const response = await Product.find();
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getProductById = async (req, res) => {
  try {
    const response = await Product.findOne({
      _id: req.params.id,
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const saveProduct = async (req, res) => {
  if (req.files === null) return res.status(400).json({ msg: 'No File Uploaded' });
  const name = req.body.title;
  let price = req.body.price;
  let description = req.body.description;
  const tagID = req.body.tags;
  const categoryID = req.body.category;
  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get('host')}/images/${fileName}`;
  const allowedType = ['.png', '.jpg', '.jpeg', '.svg'];

  if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Invalid Images' });
  if (fileSize > 5000000) return res.status(422).json({ msg: 'Image must be less than 5 MB' });

  file.mv(`./public/image/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      const category = await Category.findOne(categoryID);
      const tags = await Tag.findOne(tagID);
      // const category = await Category.findOne(categoryID);
      await Product.create({ name: name, image: fileName, url: url, price: price, description: description, tags: tags, category: category });
      res.status(201).json({ msg: 'Product Created Successfuly' });
    } catch (error) {
      console.log(error.message);
    }
  });
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id, // Correct the key name to "_id"
    });

    if (!product) return res.status(404).json({ msg: 'No Data Found' });

    let fileName = '';
    if (req.files === null) {
      fileName = product.image;
    } else {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;
      const allowedType = ['.png', '.jpg', '.jpeg'];

      if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Invalid Images' });
      if (fileSize > 5000000) return res.status(422).json({ msg: 'Image must be less than 5 MB' });

      const filepath = `./public/images/${product.image}`;
      await fs.unlink(filepath); // Use await when calling fs.unlink to make it asynchronous

      await file.mv(`./public/images/${fileName}`);
    }

    const name = req.body.title;
    const url = `${req.protocol}://${req.get('host')}/images/${fileName}`;

    // Assuming you have category and tag available in req.body
    const category = req.body.category;
    const tag = req.body.tag;

    // Use findByIdAndUpdate to simplify the update operation
    await Product.findByIdAndUpdate(
      req.params.id,
      { name, image: fileName, url, category, tag },
      { new: true } // To return the updated document
    );

    res.status(200).json({ msg: 'Product Updated Successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
  });
  if (!product) return res.status(404).json({ msg: 'No Data Found' });

  try {
    // const filepath = `./public/images/${product.image}`;
    // fs.unlinkSync(filepath);
    await Product.deleteOne({
      _id: req.params.id,
    });
    res.status(200).json({ msg: 'Product Deleted Successfuly' });
  } catch (error) {
    console.log(error.message);
  }
};
