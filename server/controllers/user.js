const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateAuthToken = require("../helpers/generateAuthToken");

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(404).send("please fill all the fields");
        }
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return res.status(400).send("user already exist");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).send("user registered successfully");
    } catch (err) {
        next(err);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(email, password, req.body);
        if (!email || !password) {
            return res.status(400).json("please fill all the fields");
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json("user does not exist");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json("invalid email and password");
        }
        const token = generateAuthToken(user._id);
        res.status(200).json({
            status: "success",
            message: "Login successful",
            token,
            userId: user._id, // Corrected this line
            name: user.name,
            email: user.email,
        });
    } catch (err) {
        next(err);
    }
};

const getuser = async (req, res) => {
    try {
        console.log('getuser function called'); // Log when the function is called
        const userId = req.user.userId;
        console.log(userId);
        const user = await User.findById(userId);
        
        console.log('User data fetched:', user); // Log the fetched user data

        if (!user) {
            console.log('User not found'); // Log if user is not found
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send(user);
    } catch (err) {
        console.error('Error fetching user:', err); // Log any errors that occur
        res.status(500).send({ message: 'Server error' });
    }
};


const updateUser = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { name, email, oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let updatedFields = {};
        if (name) {
            user.name = name;
            updatedFields.name = name;
        }
        if (email) {
            const emailExists = await User.findOne({ email });
            if (emailExists && emailExists._id.toString() !== userId) {
                return res.status(400).json({ message: 'Email is already taken' });
            }
            user.email = email;
            updatedFields.email = email;
        }
        if (oldPassword && newPassword) {
            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Old password is incorrect' });
            }
            user.password = await bcrypt.hash(newPassword, 10);
            updatedFields.password = 'updated';
        }
        await user.save();

        const response = {
            message: 'User updated successfully',
            user: {
                name: user.name,
                email: user.email,
            }
        };
       
        console.log("update details", updatedFields);
        res.status(200).json(response);

    } catch (err) {
        next(err);
    }
};

const addPeople = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { emails } = req.body;

        if (!emails || !Array.isArray(emails)) {
            return res.status(400).json({ message: 'Invalid email list' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.addPeople = [...new Set([...user.addPeople, ...emails])];
        await user.save();

        res.status(200).json({ message: 'Emails added successfully', addPeople: user.addPeople });
    } catch (err) {
        next(err);
    }
};
module.exports = { registerUser, loginUser, getuser, updateUser, addPeople};
