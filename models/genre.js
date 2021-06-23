const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 50
    }
});

module.exports = mongoose.model("Genre", genreSchema);