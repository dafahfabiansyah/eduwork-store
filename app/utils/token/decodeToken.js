import jwt from 'jsonwebtoken';
import { secretKey } from '../../../config.js';
import { User } from '../../models/user/userModel.js';
import { getToken } from './getToken.js';
import { policyFor } from '../policy/policyCheck.js';

export function decodeToken() {
  return async function (req, res, next) {
    try {
      const token = getToken(req);

      if (!token) next();

      req.user = jwt.verify(token, secretKey);

      const user = await User.findOne({ token: { $in: [token] } });

      if (!user) {
        return res.status(401).json({ message: 'Token Expired' });
      }
      next();
    } catch (error) {
      if (error && error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: error.message });
      }
      next(error);
    }
    return next();
  };
}

export function policyCheck(action, subject) {
  return function (req, res, next) {
    let policy = policyFor(req.user);

    if (!policy.can(action, subject)) {
      return res.status(401).json({ message: `You are not allowed to ${action} ${subject}` });
    }
    next();
  };
}
