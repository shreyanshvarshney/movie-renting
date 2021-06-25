const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true, minLength: 3, maxLength: 50},
    email: {type: String, required: true, unique: true, minLength: 5, maxLength: 255},
    password: {type: String, required: true, minLength: 5}
});

const validateCreateUser = (reqBody) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(reqBody);
}

const validateUserLogin = (reqBody) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(reqBody);
}

exports.User = mongoose.model("User", userSchema);
exports.validateCreateUser = validateCreateUser;
exports.validateUserLogin = validateUserLogin;
