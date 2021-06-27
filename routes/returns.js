const express = require("express");
const router = express.Router();
const moment = require("moment");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const lodash = require("lodash");

const {Customer} = require("../models/customer");
const {Movie} = require("../models/movie");
const {Rental} = require("../models/rental");
const {validateRental} = require("../models/rental");

// Fawn.init(mongoose);
// Commented this initialization becoz it has been already initailized in rentals.js

router.post("", async (req, res, next) => {
    const error = validateRental(req.body);
    if (error) return res.status(400).json({message: error.message});

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).json({message: "Invalid Customer!"});

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).json({message: "Invalid Movie!"});

    const rental = await Rental.findRental(req.body.customerId, req.body.movieId);
    if (!rental) return res.status(400).json({message: "Rental not found with this given Customer and Movie!"});

    if (rental.dateReturned) return res.status(400).json({message: "Rental already processed."});

    // rental.dateReturned = new Date();
    // const diff = moment().diff(rental.dateOut, 'days');
    // rental.rentalFee = movie.dailyRentalRate * diff;
    rental.processRental();

    const task = new Fawn.Task();

    try {
        // In Fawn i can use its update() method to update the seleted (using lodash) fields.
        task.update("rentals", {_id: rental._id}, {$set: lodash.pick(rental, ["dateReturned", "rentalFee"])} )
        .update("movies", {_id: movie._id}, {$inc: {numberInStock: 1}})
        .run();

        res.status(200).json({message: "Renal returned successfully", data: rental});
    } catch (err) {
        next(err);
    }

    // In Fawn i cannot use this technique to save my rental object with changed fields only.
    // await rental.save();

    // movie.numberInStock++;
    // await movie.save();
    // OR
    // await Movie.updateOne({_id: movie._id}, {$inc: {numberInStock: 1}});
});

module.exports = router;