const express = require("express");
const router = express.Router();
const debug = require("debug")("app:auth.routes");
const bcrypt = require("bcryptjs");
const lodash = require("lodash");
const { User, validateUserLogin } = require("../models/user");

router.post("/login", async (req, res, next) => {
    const error = validateUserLogin(req.body).error;
    if (error) {
        return res.status(400).json({message: error.message});
    }

    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) return res.status(400).json({message: "Email is incorrect!"});

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json({message: "Password is incorrect!"});
    
        // This is a custom method I added in user object in userSchema.methods.generateAuthToken
        const token = user.generateAuthToken();

        res.setHeader("Authorization", token);
        res.status(200).json({message: "Login Successfull!", expiresIn: "10 hours"});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;