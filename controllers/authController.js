const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/authModels');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username, password, "request");
        console.log(typeof password,"type");
        const hashedPassword = await bcrypt.hash(String(password), 10);
        console.log(hashedPassword, "hash");
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (err) {
        res.status(500).send('Error while registering: ' + err.message);
    }
};



exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const isPasswordValid = await bcrypt.compare(String(password), user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Invalid password');
        }
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).send('Error while logging');
    }
};


exports.changePassword = async (req, res) => {
    try {
        const { username, oldPassword, newPassword } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(200).send('User not found');
        }
        const isPasswordValid = await bcrypt.compare(String(oldPassword), user.password);
        if (!isPasswordValid) {
            return res.status(200).send('Invalid old password');
        }
        const hashedNewPassword = await bcrypt.hash(String(newPassword), 10);
        user.password = hashedNewPassword;
        await user.save();
        res.send('Password changed successfully');
    } catch (err) {
        res.status(500).send('Error changing password');
    }
};
