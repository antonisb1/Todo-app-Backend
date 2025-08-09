const { Todo } = require('../config/database');

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Todo.find().populate('user_id', '-password');
        res.json({ message: 'All tasks retrieved successfully', tasks, total: tasks.length });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getTasks = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userTasks = await Todo.find({ user_id: userId });
        res.json({ message: 'Tasks retrieved successfully', tasks: userTasks, total: userTasks.length });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getTaskById = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.userId;
        const task = await Todo.findOne({ _id: taskId, user_id: userId });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task retrieved successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const addTask = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { title, description, status = 'todo' } = req.body;
        if (!title) return res.status(400).json({ message: 'Title is required' });
        const newTask = new Todo({ title, description, status, user_id: userId });
        await newTask.save();
        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const editTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const updates = req.body;
        const updatedTask = await Todo.findOneAndUpdate(
            { _id: id, user_id: userId },
            { $set: updates },
            { new: true }
        );
        if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const removeTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const deletedTask = await Todo.findOneAndDelete({ _id: id, user_id: userId });
        if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllTasks,
    getTasks,
    getTaskById,
    addTask,
    editTask,
    removeTask
};
