const express = require("express");
const router = express.Router();
const { Movie, validateMovie } = require("../models/movie");
const { Genre } = require("../models/genre");

router.get("", async (req, res, next) => {
    try { 
        // const result = await Movie.find().populate("genre", {__v: false}).sort({name: 1}).select({__v: false});
        const result = await Movie.find().sort({name: 1}).select({__v: false});
        const count = await Movie.countDocuments();
        res.status(200).json({data: result, count: count});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.post("", async (req, res, next) => {
    const error = validateMovie(req.body);
    if (error) {
        return res.status(400).json({message: error.message});
    }

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).json({message: "Genre Not Found with this ID!"});

    const movie = new Movie({
        title: req.body.title,
        language: req.body.language,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        // This is for previous implementation
        // genre: req.body.genreId

        // Now here I can also do this but not doing this way becoz that genre object has __v property(dont want to store that) also in a more complex application genre object can have many properties which i dont want to store in movie model.
        // genre: genre(the above fetched genre by its Id.)
        genre: {
            _id: genre._id,
            name: genre.name
        }
    });

    try {
        // [Note]: Its not neccessary to create a new variable result here, I can pass my movie object in response for the client also.
        // Like this: 
        // await movie.save();
        // res.status(201).json({message: "Successfully Created", data: movie});
        
        const result = await movie.save();
        res.status(201).json({message: "Successfully Created", data: result});
    } catch (err) {
        if (err.name === "MongoError" || err.name === "ValidationError") return res.status(400).json({message: err.message});
        res.status(500).json({message: err.message});
    }
});

module.exports = router;