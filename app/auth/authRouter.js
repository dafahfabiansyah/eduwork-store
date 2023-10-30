import { User } from '../models/user/userModel.js';
import { secretKey } from '../../config.js';
import { policyCheck } from '../utils/token/decodeToken.js';
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import LocalStrategy from 'passport-local';

// Membuat local strategy
const localStrategy = new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
  try {
    const user = await User.findOne({ email: username }).select('-__v -createdAt -updatedAt -cart_items -token');
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const userWithoutPassword = { ...user.toJSON() };
      delete userWithoutPassword.password;
      return done(null, userWithoutPassword);
    } else {
      return done(null, false, { message: 'Invalid password' });
    }
  } catch (error) {
    return done(error);
  }
});

// Daftarkan local strategy dengan Passport.js
passport.use(localStrategy);

const router = express.Router();

//register
router.post('/register', async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: 'Send all required fields',
      });
    }

    const user = await User.create(req.body);
    return res.status(201).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//login
router.post('/login', async (req, res, next) => {
  passport.authenticate('local', { session: false }, async function (error, user) {
    if (error) {
      return res.status(500).send({ message: error.message });
    }
    if (user) {
      const expiresIn = 60;
      let signed = jwt.sign(user, secretKey, { expiresIn });
      await User.findByIdAndUpdate(user._id, { $push: { token: signed } });
      return res.status(200).send({
        user,
        token: signed,
      });
    } else {
      return res.status(401).send({ message: 'Unauthorized' });
    }
  })(req, res, next);
});

// logout
router.post('/logout', passport.authenticate('local', { session: false }), async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await User.findOneAndUpdate(id, { $pull: { token: { $in: [req.token] } } });
    if (!result) {
      return res.status(404).json({ message: 'User Not Found' });
    }
    return res.status(200).json({ message: 'User Successfully Logout' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.get('/me', passport.authenticate('local', { session: false }), async (req, res) => {
  // If the user is authenticated, req.user will contain the user data
  if (req.user) {
    return res.status(200).json(req.user);
  }
  return res.status(401).json({ message: 'Unauthorized' });
});

export default router;
