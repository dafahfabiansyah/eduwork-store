import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // minLength: [3, 'Panjang category minimal 3 karakter'],
      // maxLength: [20, 'Panjang category maximal 20 karakter'], // Perbaikan typo di sini
      // required: [true, 'Category harus diisi'], // Perbaikan typo di sini
    },
    address: {
      type: String,
    },
    city: {
      type: String,
      // minLength: [3, 'Panjang category minimal 3 karakter'],
      // maxLength: [20, 'Panjang category maximal 20 karakter'], // Perbaikan typo di sini
      // required: [true, 'Category harus diisi'], // Perbaikan typo di sini
    },
    province: {
      type: String,
    },
    postal_code: {
      type: Number,
    },
    detail: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      type: String,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const Address = mongoose.model('Address', addressSchema);
