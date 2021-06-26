const express = require("express");
const morgan = require("morgan");
const debug = require("debug")("app:app.js");
const dbDebug = require("debug")("app:db");
const mongoose = require("mongoose");
const app = express();
const genresRoutes = require("./routes/genres");
const customersRoutes = require("./routes/customers");
const moviesRoutes = require("./routes/movies");
const rentalsRoutes = require("./routes/rentals");
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

// The Joi objectId() method will be used in many modules, so i have defined it here once in app.js instead of each module.
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);

const config = require("config");
if (!config.get("JWT_KEY")) {
    console.log("FATAL Error: JWT_KEY is not defined");
    process.exit(1);
}

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/movie-renting-app")
    .then(() => {dbDebug("Database Connected...")})
    .catch((err) => {dbDebug("Database Connection Failed...", err)});

app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use("/images", express.static("images"));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});
if (app.get("env") === "development") {
    app.use(morgan("dev"));
    debug("Enabled Morgan Requests Logger...");
}

app.get("/", (req, res, next) => {
    res.status(200).json({status: "ok"});
});

app.use("/api/genres", genresRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/rentals", rentalsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;