const {Genre, validateGenre, validateObjectId} = require("../models/genre");
const debug = require("debug")("app:genres.controller");

exports.getGenres = async (req, res, next) => {
    try { 
        const result = await Genre.find().sort({name: 1}).select({__v: false});
        const count = await Genre.countDocuments();
        res.status(200).json({data: result, count: count});
    } catch (err) {
        next(err)
        // res.status(500).json({message: err.message});
    } 
}

exports.getGenre = async (req, res, next) => {
    const genreId = req.params.id;
    if (!validateObjectId(genreId)) return res.status(404).json({message: "Genre Not Found with this ID!"});

    try {
        const result = await Genre.findById(genreId).select({__v: false});
        if (!result) return res.status(404).json({message: "Genre Not Found with this ID!"}); 
        debug(result);
        res.status(200).json({data: result});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

exports.createGenre = async (req, res, next) => {
    const error = validateGenre(req.body);
    if (error) {
        return res.status(400).json({message: error.message});
    }

    // Created an object of my Genre model
    const genre = new Genre({
        name: req.body.name
    });

    // async await implementation
    try {
        const result = await genre.save();
        res.status(201).json({message: "Successfully Created", data: result});
    } catch (err) {
        if (err.name === "MongoError" || err.name === "ValidationError") return res.status(400).json({message: err.message});
        res.status(500).json({message: err.message});
    }

    // then() catch() implementation
    // genre.save()
    // .then((result) => {
    //     res.status(201).json({message: "Successfully Created", data: result});
    // })
    // .catch((err) => {
    //     res.status(500).json({message: "Error in creating a genre!"});
    // });
}

exports.updateGenre = async (req, res, next) => {
    const genreId = req.params.id;
    if (!validateObjectId(genreId)) return res.status(404).json({message: "Genre Not Found with this ID!"});

    const error = validateGenre(req.body);
    if (error) {
        return res.status(400).json({message: error.message});
    }
    
    // const body = new Genre({
    //     _id: genreId,
    //     name: req.body.name
    // });

    // Using update query operator => $set
    const body = {
        $set: {
            name: req.body.name
        }
    };
    try {
        const result = await Genre.findOneAndUpdate({_id: genreId}, body, {new: true, runValidators: true}).select({__v: false});
        if (!result) return res.status(404).json({message: "Genre Not Found with this ID!"}); 
        res.status(200).json({message: "Successfully Updated", data: result});
    } catch (err) {
        if (err.name === "ValidationError") return res.status(400).json({message: err.message});
        res.status(500).json({message: err.message});
    }
}

exports.deleteGenre = async (req, res, next) => {
    const genreId = req.params.id;
    if (!validateObjectId(genreId)) return res.status(404).json({message: "Genre Not Found with this ID!"});

    try {
        // findOneAndRemove() will return me the deleted document data.
        const result = await Genre.findOneAndRemove({_id: genreId});

        // it is the case when a item with valid mongo id is already deleted but if tried to delete again.
        if (!result) return res.status(404).json({message: "Genre Not Found with this ID!"});

        res.status(200).json({message: "Successfully Deleted", data: result});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}