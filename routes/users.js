const express = require("express");
const router = express.Router();
const debug = require("debug")("app:users.routes");
const { User, validateCreateUser, validateUserLogin } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

router.get("", auth, async (req, res) => {
    try {
        debug(req.userData);
        const users = await User.find().sort({name: 1}).select({__v: false, password: false});
        res.status(200).send(users);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.post("/signup", async (req, res, next) => {
    const error = validateCreateUser(req.body).error;
    if (error) {
        return res.status(400).json({message: error.message});
    }

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).json({message: "User already exsits with this email!"});

    try {
        const hashed = await bcrypt.hash(req.body.password, 10);
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashed
        });
        debug(user);
        const result = await user.save();
        res.status(201).json({message: "Successfully Created", data: {_id: result._id, name: result.name, email: result.email}});
    } catch (err) {
        if (err.name === "MongoError" || err.name === "ValidationError") return res.status(400).json({message: err.message});
        res.status(500).json({message: err.message});
    }
});

router.post("/login", async (req, res, next) => {
    const error = validateUserLogin(req.body).error;
    if (error) {
        return res.status(400).json({message: error.message});
    }

    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) return res.status(401).json({message: "Email is incorrect!"});
    
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(401).json({message: "Password is incorrect!"});
    
        // JWT Config
        const payload = {
            _id: user._id,
            email: user.email
        };
        const token = jwt.sign(payload, process.env.JWT_KEY, {expiresIn: "10h"});
    
        res.status(200).json({token: token, expiresIn: "10 hours"});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;