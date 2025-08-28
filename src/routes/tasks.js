const express = require('express');
const router = express.Router();
const {
    getAllTasks,
    getTasks,
    getTaskById,
    addTask,
    editTask,
    removeTask
} = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Protect all routes
router.use(authenticateToken);

router.get('/all', getAllTasks);       // All tasks (admin view, if wanted)
router.get('/', getTasks);             // User's tasks
router.get('/:id', getTaskById);       // Specific task (user's)
router.post('/', authenticateToken, addTask); // <--- Make sure this is present!
router.put('/:id', editTask);
router.delete('/:id', removeTask);

module.exports = router;
