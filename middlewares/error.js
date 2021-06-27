// A middleware function for handling Internal Server Errors
module.exports = (err, req, res, next) => {
    res.status(500).json({message: err.message});
}