import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    maxLength: 20,
    required: true,
  },
});

// const Category = mongoose.model('Category', categorySchema);
// export default Category;
export const Category = mongoose.model('Category', categorySchema);
