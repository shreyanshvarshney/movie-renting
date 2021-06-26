const express = require("express");
const router = express.Router();
const debug = require("debug")("app:users.routes");
const bcrypt = require("bcryptjs");
const lodash = require("lodash");
const config = require("config");
const jwt = require("jsonwebtoken");
const { User, validateCreateUser } = require("../models/user");
const checkAuth = require("../middlewares/check-auth");
const admin = require("../middlewares/admin");

router.get("", [checkAuth, admin], async (req, res) => {
    try {
        debug(req.userData);
        const users = await User.find().sort({name: 1}).select({__v: false, password: false});
        const count = await User.countDocuments();
        res.status(200).json({data: users, count: count});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get("/me", checkAuth, async (req, res) => {
    try {
        debug(req.userData);
        const user = await User.findById(req.userData._id).select({__v: false, password: false});
        res.status(200).send(user);
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

        // This is a custom method I added in user object in userSchema.methods.generateAuthToken
        const token = user.generateAuthToken();

        res.setHeader("Authorization", token);
        // Lodash provides me alot of utility functions for every data structure like Objects, arrays, strings etc.
        // Lodash is optimized version of underscore.js
        // res.status(201).json({message: "Successfully Created", data: {_id: result._id, name: result.name, email: result.email}});
        // Instead of repeating result. result. again again, I can use lodash for creating custom object with selected values to send my client.
        res.status(201).json({
            message: "Successfully Created", 
            data: lodash.pick(result, ["_id", "name", "email"])
        });
    } catch (err) {
        if (err.name === "MongoError" || err.name === "ValidationError") return res.status(400).json({message: err.message});
        res.status(500).json({message: err.message});
    }
});

module.exports = router;