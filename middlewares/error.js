// A middleware function for handling Internal Server Errors
module.exports = (err, req, res, next) => {
    res.status(err.status).json({message: err.message});
}