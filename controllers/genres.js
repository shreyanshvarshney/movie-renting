const Genre = require("../models/genre");
const Joi = require("joi");
const debug = require("debug")("app:genres.controller");

const validateGenre = (reqBody) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required()
    });
    return schema.validate(reqBody).error;
};

exports.getGenres = async (req, res, next) => {
    const result = await Genre.find().sort({name: 1}).select({__v: false});
    const count = await Genre.countDocuments();
    res.status(200).json({data: result, count: count});
}

exports.getGenre = async (req, res, next) => {
    try {
        const genreId = req.params.id;
        const result = await Genre.findById(genreId).select({__v: false});
        debug(result);
        res.status(200).json({data: result});
    } catch (err) {
        res.status(404).json({message: "Genre not found with this id"});
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
        res.status(500).json({message: "Error in creating a genre!"});
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
    try {
        const result = await Genre.findById(genreId);
        debug(result);
        if (!result) throw new Error();
    } catch (err) {
        return res.status(404).json({message: "Genre not found with this id."});
    }

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
    res.status(200).json({message: "Successfully Updated", data: result});
    } catch (err) {
        res.status(500).json({message: "Couldn't update the genre."});
    }
}

exports.deleteGenre = async (req, res, next) => {
    const genreId = req.params.id;
    let result;
    try {
        result = await Genre.findById(genreId).select({name: 1});
        debug(result);
        // it is the case when a item with valid id is already deleted but if tried to delete again.
        if (!result) throw new Error();
    } catch (err) {
        return res.status(400).json({message: "Genre not found with this id."});
    }
    try {
        // findOneAndRemove() will also return me the deleted document data.
        // const result = await Genre.findOneAndRemove({_id: genreId})
        const deletedResult = await Genre.deleteOne({_id: genreId});
        if (deletedResult.deletedCount > 0) {
            res.status(200).json({message: "Successfully Deleted", data: result});
        }
    } catch (err) {
        res.status(500).json({message: "Error in deleting genre!"});
    }
}