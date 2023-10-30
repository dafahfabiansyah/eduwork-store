import mongoose from 'mongoose';

const tagSchema = mongoose.Schema({
  name: {
    type: String,
    // minLength: [3, 'Panjang category minimal 3 karakter'],
    // maxLength: [20, 'Panjang category maximal 20 karakter'], // Perbaikan typo di sini
    // required: [true, 'Category harus diisi'], // Perbaikan typo di sini
  },
});

export const Tag = mongoose.model('Tag', tagSchema);
