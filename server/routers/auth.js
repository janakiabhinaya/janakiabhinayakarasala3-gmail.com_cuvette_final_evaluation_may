const express = require("express");
const router = express.Router();
const {registerUser,loginUser,getuser,updateUser,addPeople} = require("../controllers/user");
const authenticateToken = require('../middileware/auth');

router.get('/', (req,res)=>{
    res.send("auth route").status(200);
});
router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/userdata/:userId",authenticateToken,getuser);
router.patch("/userdata/:userId",authenticateToken,updateUser);
router.patch("/addpeople", authenticateToken, addPeople);
module.exports = router;
