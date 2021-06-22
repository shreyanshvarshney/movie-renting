const express = require("express");
const morgan = require("morgan");
const debug = require("debug")("app:app.js");
const app = express();
const genresRoutes = require("./routes/genres");

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

app.use("/health", (req, res, next) => {
    res.status(200).json({status: "ok"});
});

app.use("/api/genres", genresRoutes);

module.exports = app;