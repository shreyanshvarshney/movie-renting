const express = require("express");
const router = express.Router();
const moment = require("moment");

const {Customer} = require("../models/customer");
const {Movie} = require("../models/movie");
const {Rental} = require("../models/rental");
const {validateRental} = require("../models/rental");

router.post("", async (req, res, next) => {
    const error = validateRental(req.body);
    if (error) return res.status(400).json({message: error.message});

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).json({message: "Invalid Customer!"});

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).json({message: "Invalid Movie!"});

    const rental = await Rental.findOne({"customer._id": req.body.customerId, "movie._id": req.body.movieId});
    if (!rental) return res.status(400).json({message: "Rental not found with this given Customer and Movie!"});

    if (rental.dateReturned) return res.status(400).json({message: "Rental already processed."});

    rental.dateReturned = new Date();
    const diff = moment().diff(rental.dateOut, 'days');
    rental.rentalFee = movie.dailyRentalRate * diff;
    await rental.save();
    // movie.numberInStock++;
    // await movie.save();
    await Movie.updateOne({_id: movie._id}, {$inc: {numberInStock: 1}});

    res.status(200).json({message: "Renal returned successfully", data: rental});
});

module.exports = router;