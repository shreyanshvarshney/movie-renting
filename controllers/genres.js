const Joi = require("joi");

const genres = [
    {id: 1, name: "Action"},
    {id: 2, name: "Adventure"},
    {id: 3, name: "Comedy"},
    {id: 4, name: "Crime and mystery"},
    {id: 5, name: "Fantasy"},
    {id: 6, name: "Historical"},
    {id: 7, name: "Romance"},
    {id: 8, name: "Horror"},
    {id: 9, name: "Science fiction"},
    {id: 10, name: "Thriller"},
];

let genresLength = genres.length;

const validateGenre = (reqBody) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(reqBody).error;
};

exports.getGenres = (req, res, next) => {
    res.status(200).json({data: genres});
}

exports.getGenre = (req, res, next) => {
    const genreId = +req.params.id;
    const result = genres.find((genre) => genre.id === genreId);
    if (!result) {
        return res.status(404).json({message: "Genre not found with this id."});
    }
    res.status(200).json({data: result});
}

exports.createGenre = (req, res, next) => {
    // if (!Object.entries(req.body).length) {
    //     return res.status(400).json({message: "Missing genre object"});
    // }
    // if (!req.body.name) {
    //     return res.status(400).json({message: "Missing genre name field"});
    // }
    const error = validateGenre(req.body);
    if (error) {
        return res.status(400).json({message: error.message});
    }
    const genre = {
        id: genresLength + 1,
        name: req.body.name
    }
    genresLength++;
    genres.push(genre);
    res.status(201).json({message: "Successfully Created", data: genre});
}

exports.updateGenre = (req, res, next) => {
    const error = validateGenre(req.body);
    if (error) {
        return res.status(400).json({message: error.message});
    }

    const genreId = +req.params.id;
    const result = genres.find((genre) => genre.id === genreId);
    if (!result) {
        return res.status(404).json({message: "Genre not found with this id."});
    }

    result.name = req.body.name;
    res.status(200).json({message: "Successfully Updated", data: result});
}

exports.deleteGenre = (req, res, next) => {
    const genreId = +req.params.id;
    const result = genres.find((genre) => genre.id === genreId);
    if (!result) {
        return res.status(404).json({message: "Genre not found with this id."});
    }

    const index = genres.indexOf(result);
    genres.splice(index, 1);
    res.status(200).json({message: "Successfully Deleted", data: result});
}