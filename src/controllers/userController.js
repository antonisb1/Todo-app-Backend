const { User } = require('../config/database');

// Get all users (excluding passwords)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude password field
        res.json({ message: 'Users retrieved successfully', users });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get one user by ID (excluding password)
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId, '-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User retrieved successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Optionally: Only allow self-delete or admin, e.g. if (req.user.userId !== userId) return res.status(403);
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser)
            return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    deleteUser
};

