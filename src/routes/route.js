const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController")
const { validateAuthor, validate } = require('../middlewares/authorValidations');
const { validatedblog, validateBlog } = require('../middlewares/blogsValidations');


router.post("/authors", validateAuthor, validate, authorController.createAuthor)

router.post("/blogs", validateBlog, validatedblog, blogController.createBlog)

router.get("/blogs", blogController.getBlogs)

router.put("/blogs/:blogId",  blogController.putBlog)

router.delete("/blogs/:blogId",  blogController.deleteBlog )

router.delete("/blogs", blogController.blogByQuery)
module.exports = router;