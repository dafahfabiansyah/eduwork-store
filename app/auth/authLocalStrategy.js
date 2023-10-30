import { User } from '../models/user/userModel.js';
import bcrypt from 'bcrypt';

const localStrategy = {
  async authenticate(email, password, done) {
    try {
      const user = await User.findOne({ email }).select('__v -token -createdAt -updatedAt -cart_items');
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Remove the password field from the user object
        const userWithoutPassword = { ...user.toObject() };
        delete userWithoutPassword.password;
        return done(null, userWithoutPassword);
      } else {
        return done(null, false, { message: 'Incorrect password' });
      }
    } catch (error) {
      return done(error);
    }
  },
};

export default localStrategy;
