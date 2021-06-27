const mongoose = require("mongoose");
const Joi = require("joi");
const moment = require("moment");

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
            name: {type: String, required: true, minLength: 3, maxLength: 50},
            email: {type: String, required: true, minLength: 3, maxLength: 50},
            isPremium: {type: Boolean, default: false},
            phone: {type: String, required: true, minLength: 5, maxLength: 50}
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {type: String, required: true, trim: true, minLength: 3, maxLength: 255},
            dailyRentalRate: {type: Number, required: true, min: 0, max: 255},
        }),
        required: true
    },
    rentalFee: {type: Number, min: 0},
    dateOut: {type: Date, default: Date.now, required: true},
    dateReturned: {type: Date}
});

// In OOPS there are two types of class methods:
// 1. Static Methods: these methods can be directly accessed using Class Name like Fawn.Task()
// 2. Instance Methods: these methods can be only accessable with class intances or objects.

// Static method of my Rental Model
rentalSchema.statics.findRental = function(customerId, movieId) {
    // here "this" represents the Rental Model
    return this.findOne({"customer._id": customerId, "movie._id": movieId});
    // I am returning the promise as it is. So i will not await this here. The function caller will do.
}

// Instance method of my Rental Model
rentalSchema.methods.processRental = function() {
    // here "this" represents the rentalSchema
    this.dateReturned = new Date();
    const diff = moment().diff(this.dateOut, 'days');
    this.rentalFee = this.movie.dailyRentalRate * diff;
}

exports.Rental = mongoose.model("Rental", rentalSchema);

exports.validateRental = (reqBody) => {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });
    return schema.validate(reqBody).error;
};