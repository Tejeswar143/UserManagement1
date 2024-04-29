const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, name, Email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, name, Email, password: hashedPassword });
        await user.save();
        res.status(201)
            .header('Content-Type', 'application/json')
            .json({ status: 201, message: 'User registered successfully' });
    } catch (error) {
        res.status(500)
            .header('Content-Type', 'application/json')
            .json({ status: 500, error: 'Registration failed' });
    }
};

exports.adminRegister = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            name: req.body.name,
            Email: req.body.Email,
            password: hashedPassword,
            isAdmin: true,
            role: "admin"
        });
        await user.save();
        res.status(201)
            .header('Content-Type', 'application/json')
            .json({ status: 201, message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500)
            .header('Content-Type', 'application/json')
            .json({ status: 500, error: 'Admin registration failed' });
    }
};

exports.login = async (req, res) => {
    try {
        const { Email, password } = req.body;
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(401)
                .header('Content-Type', 'application/json')
                .json({ status: 401, error: 'Authentication failed - User not found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401)
                .header('Content-Type', 'application/json')
                .json({ status: 401, error: 'Authentication failed - Incorrect password' });
        }
        // Create a payload excluding the password
        const payload = {
            userId: user._id,
            username: user.username,
            name: user.name,
            Email: user.Email,
            isAdmin: user.isAdmin,
            role: user.role
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        // Send the success response
        res.status(200)
            .header('Content-Type', 'application/json')
            .header('Authorization', `Bearer ${token}`)
            .json({ status: 200, logged: true, token, message: "Sign in successful" });
    } catch (error) {
        // Send the error response
        res.status(500)
            .header('Content-Type', 'application/json')
            .json({ status: 500, error: 'Login failed - Internal Server Error' });
    }
};
