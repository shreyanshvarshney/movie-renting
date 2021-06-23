const express = require("express");
const router = express.Router();
const { Movie, validateMovie } = require("../models/movie");
const { Genre } = require("../models/genre");

router.get("", async (req, res, next) => {
    const result = await Movie.find().populate("genre", {__v: false}).sort({name: 1}).select({__v: false});
    const count = await Movie.countDocuments();
    res.status(200).json({data: result, count: count});
});

router.post("", async (req, res, next) => {
    const error = validateMovie(req.body);
    if (error) {
        return res.status(400).json({message: error.message});
    }

    try {
        const result = await Genre.findById(req.body.genreId);
        if (!result) throw new Error();
    } catch (err) {
        return res.status(400).json({message: "Invalid Genre!"});
    }

    const movie = new Movie({
        title: req.body.title,
        language: req.body.language,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: req.body.genreId
    });

    try {
        const result = await movie.save();
        res.status(201).json({message: "Successfully Created", data: result});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;