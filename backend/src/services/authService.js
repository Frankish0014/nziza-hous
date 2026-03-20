import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { createUser, findByEmail } from '../repositories/userRepository.js';

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

export const register = async ({ name, email, password, role }) => {
  const existing = await findByEmail(email);
  if (existing) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const normalizedRole = role || 'customer';
  const user = await createUser({ name, email, passwordHash, roleName: normalizedRole });
  const token = signToken({ ...user, role: normalizedRole });

  return { user: { ...user, role: normalizedRole }, token };
};

export const login = async ({ email, password }) => {
  const user = await findByEmail(email);
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const token = signToken(user);
  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  };
};

