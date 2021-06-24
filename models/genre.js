const mongoose = require("mongoose");
const Joi = require("joi");

exports.genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 50
    }
});

exports.Genre = mongoose.model("Genre", this.genreSchema);

exports.validateGenre = (reqBody) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required()
    });
    return schema.validate(reqBody).error;
};

exports.validateObjectId  = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};
