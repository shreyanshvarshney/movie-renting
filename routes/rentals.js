const express = require("express");
const router = express.Router();
const Fawn = require("fawn");
const mongoose = require("mongoose");
const { Rental, validateRental } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const checkAuth = require("../middlewares/check-auth");

Fawn.init(mongoose);

router.get("", async (req, res, next) => {
    const result = await Rental.find().sort({dateOut: -1}).select({__v: false});
    const count = await Rental.countDocuments();
    res.status(200).json({data: result, count: count});
});

router.post("", checkAuth, async (req, res, next) => {
    const error = validateRental(req.body);
    if (error) {
        return res.status(400).json({message: error.message});
    }

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).json({message: "Invalid Customer!"});

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).json({message: "Invalid Movie!"});

    if (movie.numberInStock === 0) {
        return res.status(400).json({message: "Movie not in stock!"});
    }

    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            email: customer.email,
            isPremium: customer.isPremium,
            phone: customer.phone,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        rentalFee: movie.dailyRentalRate
    });

    // The use of transaction here is because:
    // 1. saving my rental object to the db  2. decreament numberInStock and updating the movie document in db.
    // Are two independent operations, suppose if any one of them fails than other wiil be or already executed.
    // This will create data inconsistency.
    // So now using transaction concept I want to run them as single unit operation. If one fails none of them will be executed.
    // And my db will be in the initial state as it was before both operations.

    const task = new Fawn.Task();
    // Now here I can add one or more operations and all these operations together will be treated as a unit.
    // Here I am directly working with the collection, so i have to provide name of the collection which is prural and lowercase.
    // Second argument will be my Rental Model object to be posted.

    // There maybe chances that this transaction fails so i will wrap this in try catch block:
    try {
        task.save("rentals", rental)
        .update("movies", {_id: movie._id}, { $inc: { numberInStock: -1 } })
        .run();
        // No changes will be made to my database until I call task.run();

        // [!!IMPORTANT] concept of this below retal object of Rental model i have created
        // I have not mentioned _id and dateOut fields when creating rental obejct. But in the body of the reponse to the client I can see boht there.
        // So, MongoDB Database DID NOT set these values, I define them in Mongoose Schema.
        // So when I create a new rental object, mongoose knew my rental schema and look for various properties and default values.
        // These both properties values were SET before I save this document to the DB by the MongoDB Driver.
        res.status(201).json({message: "Successfully Rented", data: rental});
    } catch (err) {
        res.status(500).json({message: err.message});
    }

    // try {
    //     const result = await rental.save();
    //     res.status(201).json({message: "Successfully Rented", data: result});
    // } catch (err) {
    //     return res.status(500).json({message: err.message});
    // }
    
    // const body = {
    //     $inc: {
    //         numberInStock: -1
    //     }
    // };
    // await Movie.updateOne({_id: movie._id}, body);
    // movie.numberInStock--;
    // movie.save();
});

module.exports = router;