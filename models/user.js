const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true, minLength: 3, maxLength: 50},
    email: {type: String, required: true, unique: true, minLength: 5, maxLength: 255},
    password: {type: String, required: true, minLength: 5},
    isAdmin: {type: Boolean, default: false}
});

// According to "Information Expert Principle" in OOPs
// When i am creating a JWT, I am using user id and email in its payload, Its defined in my User Model, so user schema is responsible
// for generating Auth Token, and it can easily access user properties using "this" keyword.
// I can create custom schema methods using its methods property
// Its important to use function() syntax, CANNOT USE arrow functions.
userSchema.methods.generateAuthToken = function() {
    // JWT Config
    // here this refers to the userSchema object.
    const payload = {
        _id: this._id,
        email: this.email,
        isAdmin: this.isAdmin
    };
    const token = jwt.sign(payload, config.get("JWT_KEY"), {expiresIn: "10h"});
    return token;
}

exports.User = mongoose.model("User", userSchema);

exports.validateCreateUser = (reqBody) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(reqBody);
}

exports.validateUserLogin = (reqBody) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(reqBody);
}
