const express = require("express");
const router = express.Router();
const { Rental, validateRental } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");

router.get("", async (req, res, next) => {
    const result = await Rental.find().sort({dateOut: -1}).select({__v: false});
    const count = await Rental.countDocuments();
    res.status(200).json({data: result, count: count});
});

router.post("", async (req, res, next) => {
    const error = validateRental(req.body);
    if (error) {
        return res.status(400).json({message: error.message});
    }
    let customer, movie;
    try {
        customer = await Customer.findById(req.body.customerId);
        if (!customer) throw new Error();
    } catch (err) {
        return res.status(400).json({message: "Invalid Customer!"});
    }
    try {
        movie = await Movie.findById(req.body.movieId);
        if (!movie) throw new Error();
    } catch (err) {
        return res.status(400).json({message: "Invalid Movie!"});
    }

    if (movie.numberInStock === 0) {
        return res.status(400).json({message: "Movie not in stock!"});
    }

    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isPremium: customer.isPremium,
            phone: customer.phone,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        rentalFee: movie.dailyRentalRate,
    });

    // The use of transaction here is because:
    // 1. saving my rental object to the db  2. decreament numberInStock and updating the movie document in db.
    // Are two independent operations, suppose if any one of them fails than other wiil be or already executed.
    // This will create data inconsistency.
    // So now using transaction concept I want to run them as single unit operation. If one fails none of them will be executed.
    // And my db will be in the initial state as it was before both operations.
    try {
        const result = await rental.save();
        res.status(201).json({message: "Successfully Rented", data: result});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
    movie.numberInStock--;
    movie.save();
});

module.exports = router;