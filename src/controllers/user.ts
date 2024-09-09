import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

import User from "../model/user";
import { generateToken } from "../utils/token";

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { firstname, lastname, email, role, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    firstname,
    lastname,
    email,
    role,
    password,
  });

  if (user) {
    res.status(201).json({
      status: "success",
      method: req.method,
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user: any = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken({
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
      email: user.email,
    });

    res.json({
      status: "success",
      method: req.method,
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
      email: user.email,
      token,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req: any, res: any) => {
  const user = await User.findById(req.user.id);

  if (user) {
    res.json({
      status: "success",
      method: req.method,
      data: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        email: user.email,
      },
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export { createUser, loginUser, getUserProfile };
