const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController");
const { validateAuthor, validate } = require('../middlewares/authorValidations');


router.post("/authors", validateAuthor, validate, authorController.createAuthor)

module.exports = router;