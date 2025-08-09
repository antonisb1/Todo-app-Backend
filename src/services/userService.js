// services/userService.js

const bcrypt = require('bcryptjs');
const { User } = require('../config/database');

/**
 * Create a new user with hashed password
 * @param {Object} userData - { name, lastname, email, password }
 * @returns {Promise<Object>} newly created user document
 */
const createUser = async ({ name, lastname, email, password }) => {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user document
    const newUser = new User({
        name,
        lastname,
        email,
        password: hashedPassword
    });

    // Save in DB
    return await newUser.save();
};

/**
 * Find user by email
 * @param {string} email
 * @returns {Promise<Object|null>} user document or null
 */
const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

module.exports = {
    createUser,
    findUserByEmail
};
