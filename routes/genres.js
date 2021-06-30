const express = require("express");
const router = express.Router();
const genresController = require("../controllers/genres");
const checkAuth = require("../middlewares/check-auth");
const admin = require("../middlewares/admin");
var timeout = require('connect-timeout')

router.get("", timeout("5s"), genresController.getGenres);

router.get("/:id", genresController.getGenre);

router.post("", checkAuth, genresController.createGenre);

router.patch("/:id", checkAuth, genresController.updateGenre);

router.delete("/:id", [checkAuth, admin], genresController.deleteGenre);

module.exports = router;