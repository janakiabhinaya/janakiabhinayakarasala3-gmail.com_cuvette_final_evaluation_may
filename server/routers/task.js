const express = require("express");
const router = express.Router();
const { createTask, getTasksByUserId, updateTask, analyticsdata, deleteTask, 
  updateAllTaskDetails, gettaskByid} = require("../controllers/usertaskController");
const authenticateToken = require('../middileware/auth');

router.get("/", (req, res) => {
  res.status(200).send("Task Route!");
});

router.post("/create", authenticateToken, createTask);
router.get('/user/:userId', authenticateToken, getTasksByUserId);
router.patch('/update/:id', authenticateToken, updateTask);
router.get('/analytics/:userId', authenticateToken, analyticsdata);
router.delete('/delete/:id', authenticateToken, deleteTask);
router.patch('/updateAll/:id',authenticateToken, updateAllTaskDetails);
router.get('/taskdata/:id',gettaskByid);


module.exports = router;
