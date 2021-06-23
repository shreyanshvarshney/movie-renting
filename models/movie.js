const mongoose = require("mongoose");
const Joi = require("joi");

const movieSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true, trim: true, minLength: 3, maxLength: 255},
    language: {type: String, required: true, lowercase: true, trim: true, enum: ["english", "hindi"]},
    numberInStock: {type: Number, required: true, min: 0, max: 255},
    dailyRentalRate: {type: Number, required: true, min: 0, max: 255},
    genre: {type: mongoose.SchemaTypes.ObjectId, ref: "Genre", required: true}
});

exports.Movie = mongoose.model("Movie", movieSchema);

exports.validateMovie = (reqBody) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        language: Joi.string().lowercase().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required(),
        genreId: Joi.string().required()
    });

    return schema.validate(reqBody).error;
};