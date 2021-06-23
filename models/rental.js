const mongoose = require("mongoose");
const Joi = require("joi");

// Points to remember that customer field of my rental schema can be like this:
// const customerSchema = require("../models/customer");
// const rentalSchema = new mongoose.Schema({
//     customer: {
//         type: customerSchema,
//         required: true
//     }
// });
// But this implementation will include all fields of my customer in my rentals schema which is really unnecessary.
// So I will create custom mongoose.Schema as below for customer type field which are really reqd in rentals schema.
// Their is also another implementation in which I can store only the id of customer and movie in rentals schema but that will increase query complexity.
const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {type: String, required: true, minLength: 3, maxLength: 50, trim: true},
            isPremium: {type: Boolean, default: false},
            phone: {type: String, required: true, minLength: 5, maxLength: 50, trim: true}
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {type: String, required: true, unique: true, trim: true, minLength: 3, maxLength: 255},
            dailyRentalRate: {type: Number, required: true, min: 0, max: 255},
        }),
        required: true
    },
    rentalFee: {type: Number, min: 0},
    dateOut: {type: Date, default: Date.now, required: true},
    dateReturned: {type: Date}
});

exports.Rental = mongoose.model("Rental", rentalSchema);

exports.validateRental = (reqBody) => {
    const schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required()
    });
    return schema.validate(reqBody).error;
};