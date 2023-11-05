import mongoose, { Schema } from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: [3, 'Panjang product minimal 3 karakter'],
      required: [true, 'Nama makanan harus di isi'],
    },
    description: {
      type: String,
      maxLength: [1000, 'Panjang deskripsi maksimal 1000 karakter'],
    },
    price: {
      type: Number,
      default: 0,
    },
    image: String,

    category: {
      type: Schema.Types.ObjectId,
      // type: String,
      ref: 'Category',
    },
    tags: {
      type: Schema.Types.ObjectId,
      // type: String,
      ref: 'Tag',
    },
  },

  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
