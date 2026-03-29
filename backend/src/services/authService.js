const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { generateToken } = require('../utils/token');

const registerUser = async (userData) => {
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'user'
  });

  const userWithoutPassword = user.toJSON();
  delete userWithoutPassword.password;

  return userWithoutPassword;
};

const loginUser = async (email, password) => {
  const user = await User.scope('withPassword').findOne({ where: { email } });
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken({ id: user.id, role: user.role });
  
  const userWithoutPassword = user.toJSON();
  delete userWithoutPassword.password;

  return { token, user: userWithoutPassword };
};

const getUserById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserById
};