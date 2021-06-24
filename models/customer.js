const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
    name: {type: String, required: true, minLength: 3, maxLength: 50, trim: true},
    email: {type: String, required: true, unique: true, minLength: 10, maxLength: 50, trim: true},
    isPremium: {type: Boolean, default: false},
    phone: {type: String, required: true, minLength: 7, maxLength: 15, trim: true},
});

exports.Customer = mongoose.model("Customer", customerSchema);

exports.validateCustomer = (reqBody) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(10).max(50).required(),
        phone: Joi.string().min(7).max(15).required(),
        isPremium: Joi.boolean()
    });
    return schema.validate(reqBody).error;
}

exports.validateUpdateCustomer = (reqBody) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50),
        email: Joi.string().min(10).max(50),
        phone: Joi.string().min(7).max(15),
        isPremium: Joi.boolean()
    });
    return schema.validate(reqBody).error;
}

exports.validateObjectId  = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};
