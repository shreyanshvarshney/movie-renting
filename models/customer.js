const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
    name: {type: String, required: true, minLength: 3, maxLength: 50, trim: true},
    isPremium: {type: Boolean, default: false},
    phone: {type: String, required: true, minLength: 5, maxLength: 50, trim: true}
});

exports.Customer = mongoose.model("Customer", customerSchema);

exports.validateCustomer = (reqBody) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isPremium: Joi.boolean()
    });
    return schema.validate(reqBody).error;
}

exports.validateObjectId  = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};
