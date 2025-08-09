const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById } = require('../controllers/userController'); // Make sure this path is correct
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/', getAllUsers);      // <--- These must all be functions
router.get('/:id', getUserById);

module.exports = router;
