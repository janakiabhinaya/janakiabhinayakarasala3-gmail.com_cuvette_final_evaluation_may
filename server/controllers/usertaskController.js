const mongoose = require('mongoose');
const UserTask = require("../models/usertask");
const User = require("../models/user");

const createTask = async (req, res, next) => {
    try {
        const {
            title,
            selectpriority,
            assignto,
            checklist,
            duedate,
        } = req.body;

        if (!title || !selectpriority || !checklist || checklist.length === 0) {
            return res.status(400).send("Please fill all the required fields");
        }

        const formattedChecklist = checklist.map(item => {
            if (typeof item === 'string') {
                return { text: item, completed: false };
            } else if (typeof item === 'object' && item.text) {
                return { text: item.text, completed: !!item.completed };
            }
            return null;
        }).filter(item => item !== null);

        const newTask = new UserTask({
            title,
            selectpriority,
            assignto,
            checklist: formattedChecklist,
            userId: req.body.userId, // Assign userId from request body
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        if (duedate) {
            newTask.duedate = duedate;
        }

        await newTask.save();
        res.status(201).send("Task created successfully");
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).send(`Failed to create task: ${err.message}`);
        next(err);
    }
};
  

const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { checklist, status } = req.body;
        // Find the task by ID
        const task = await UserTask.findById(id);
        console.log()
        if (!task) {
            return res.status(404).send({ message: 'Task not found' });
        }
        console.log('Task found:', task);
        // Update the task fields if they are provided in the request body
        task.status = status || task.status;

        // Update checklist items if provided
        if (checklist && Array.isArray(checklist)) {
            task.checklist = checklist.map(item => ({
                text: item.text,
                completed: item.completed
            }));
        }

        // Update the updatedAt timestamp
        task.updatedAt = new Date();

        // Save the updated task to the database
        const updatedTask = await task.save();

        // Send the updated task in the response
        res.status(200).send(updatedTask);
    } catch (err) {
        next(err);
    }
};

const analyticsdata = async (req, res) => {
    try {
        const userId = req.params.userId;
        const userEmail = req.headers.email; // Get the email from request headers

        console.log('User ID received in backend:', userId);
        console.log('Email received:', userEmail);

        // Fetch tasks by userId
        const tasksByUserId = await UserTask.find({
            userId: userId,
        });

        // Fetch tasks by email
        const tasksByEmail = await UserTask.find({
            assignto: userEmail,
        });

        // Combine both task sets, avoiding duplicates
        const tasksMap = new Map();
        [...tasksByUserId, ...tasksByEmail].forEach(task => tasksMap.set(task._id.toString(), task));
        const combinedTasks = Array.from(tasksMap.values());

        // Perform analytics on combinedTasks
        const analytics = {
            backlog: 0,
            todo: 0,
            inProgress: 0,
            done: 0,
            lowPriority: 0,
            moderatePriority: 0,
            highPriority: 0,
            dueDateTasks: 0,
        };

        combinedTasks.forEach(task => {
            // Count tasks by status
            if (task.status === 'backlog') analytics.backlog++;
            if (task.status === 'todo') analytics.todo++;
            if (task.status === 'inProgress') analytics.inProgress++;
            if (task.status === 'done') analytics.done++;

            // Count tasks by priority
            if (task.selectpriority === 'LOW PRIORITY') analytics.lowPriority++;
            if (task.selectpriority === 'MODERATE PRIORITY') analytics.moderatePriority++;
            if (task.selectpriority === 'HIGH PRIORITY') analytics.highPriority++;

            // Count tasks with due dates
            if (task.duedate) analytics.dueDateTasks++;
        });

        res.json(analytics);
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;

        const task = await UserTask.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).send({ message: 'Task not found' });
        }

        res.status(200).send({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).send(`Failed to delete task: ${err.message}`);
        next(err);
    }
};

const gettaskByid = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await UserTask.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateAllTaskDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            title,
            selectpriority,
            assignto,
            checklist, // Contains items to add/update
            duedate,
            status,
            checklistToDelete // Contains ids of items to delete
        } = req.body;

        // Extract logged-in user ID from request (assuming it's available in headers or JWT payload)
        const loggedInUserId = req.user.userId; // Adjust this line according to how you manage authentication

        // Find the task by ID
        const task = await UserTask.findById(id);
        if (!task) {
            return res.status(404).send({ message: 'Task not found' });
        }

        // Update task fields
        task.title = title || task.title;
        task.selectpriority = selectpriority || task.selectpriority;
        task.status = status || task.status; 
        // Only update 'assignto' if logged-in user ID matches task's userId
        if (task.userId.toString() === loggedInUserId) {
            task.assignto = assignto || task.assignto;
        }
        // Handle checklist items
        if (checklist) {
            if (Array.isArray(checklist)) {
                task.checklist = checklist.map(item => ({
                    text: item.text,
                    completed: item.completed
                }));
            }
        }

        // Handle checklist items to delete
        if (checklistToDelete && Array.isArray(checklistToDelete)) {
            task.checklist = task.checklist.filter(item => !checklistToDelete.includes(item._id.toString()));
        }

        // Update due date if provided
        if (duedate) {
            task.duedate = duedate;
        }

        // Update the updatedAt timestamp
        task.updatedAt = new Date();

        // Save the updated task to the database
        const updatedTask = await task.save();

        // Send the updated task in the response
        res.status(200).send(updatedTask);
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).send(`Failed to update task: ${err.message}`);
        next(err);
    }
};

const getTasksByUserId = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const filter = req.query.filter; // Get the filter from query parameters
        const userEmail = req.headers.email; // Get the email from query parameters

        console.log('User ID received in backend:', userId);
        console.log('Filter received:', filter);
        console.log('Email received:', userEmail);

        const now = new Date();
        let startDate;
        let endDate = now;

        // Determine the startDate based on the filter
        switch (filter) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'thisWeek':
                const dayOfWeek = now.getDay(); // Get the current day of the week (0 - Sunday, 6 - Saturday)
                const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Calculate the number of days to the previous Monday
                startDate = new Date(now);
                startDate.setDate(now.getDate() - daysToMonday); // Set startDate to the previous Monday
                break;
            case 'thisMonth':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            default:
                startDate = new Date(0); // If no valid filter is provided, retrieve all tasks
                break;
        }

        // Fetch tasks by userId
        const tasksByUserId = await UserTask.find({
            userId: userId,
            createdAt: { $gte: startDate, $lt: endDate }
        });

        // Fetch tasks by email
        const tasksByEmail = await UserTask.find({
            assignto: userEmail,
            createdAt: { $gte: startDate, $lt: endDate }
        });

        // Combine both task sets, avoiding duplicates
        const tasksMap = new Map();
        [...tasksByUserId, ...tasksByEmail].forEach(task => tasksMap.set(task._id.toString(), task));
        const combinedTasks = Array.from(tasksMap.values());

        res.status(200).json(combinedTasks);
    } catch (err) {
        console.error('Error retrieving tasks:', err);
        res.status(500).send(`Failed to retrieve tasks: ${err.message}`);
        next(err);
    }
};

module.exports = { createTask, getTasksByUserId, updateTask, analyticsdata, 
    deleteTask, updateAllTaskDetails, gettaskByid};
