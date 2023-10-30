import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
// import mongooseSequence from 'mongoose-sequence';

// const AutoIncrement = mongooseSequence(mongoose);

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    full_name: {
      type: String,
      required: true,
    },
    customer_id: {
      type: Number,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: async function (value) {
          const existingUser = await this.constructor.findOne({ email: value });
          return !existingUser;
        },
        message: 'Email is already registered.',
      },
    },
    password: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    token: [String],
  },
  { timestamps: true }
);

const HASH_ROUND = 10;
userSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

// userSchema.plugin(AutoIncrement, { inc_field: 'customer_id' });

export const User = mongoose.model('User', userSchema);
