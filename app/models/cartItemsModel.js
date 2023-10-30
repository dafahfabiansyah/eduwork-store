import mongoose from 'mongoose';

const cartSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    required: true,
  },
  image_url: String,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

export const Cart = mongoose.model('Cart', cartSchema);
