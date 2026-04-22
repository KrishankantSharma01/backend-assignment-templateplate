import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import env from '../config/env.js';
import asyncHandler from '../utils/asyncHandler.js';
import HttpError from '../utils/httpError.js';

function generateToken(user) {
  return jwt.sign({ sub: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName || !email || !password) {
    throw new HttpError(400, "Full name, email, and password are required.");
  }

  const existingUser = await Student.findOne({ email });
  if (existingUser) {
    throw new HttpError(409, "Email is already in use.");
  }

  const user = await Student.create({
    fullName,
    email,
    password,
    role: role === "counselor" ? "counselor" : "student",
  });

  const token = generateToken(user);
  
  const userProfile = user.toObject();
  delete userProfile.password;

  res.status(201).json({
    token,
    user: userProfile,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new HttpError(400, "Email and password are required.");
  }

  const user = await Student.findOne({ email });
  if (!user) {
    throw new HttpError(401, "Invalid email or password.");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new HttpError(401, "Invalid email or password.");
  }

  const token = generateToken(user);

  const userProfile = user.toObject();
  delete userProfile.password;

  res.json({
    token,
    user: userProfile,
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({
    user: req.user,
  });
});

export { register,
  login,
  me,
 };
