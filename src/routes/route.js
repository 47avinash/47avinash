const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController")
const { validateAuthor, validate } = require('../middlewares/authorValidations');
const { validatedblog, validateBlog } = require('../middlewares/blogsValidations');
const mw = require("../middlewares/auth")

router.post("/authors", validateAuthor, validate, authorController.createAuthor)

router.post("/login", authorController.logInUser)

router.post("/blogs", validateBlog, validatedblog, mw.authorization, blogController.createBlog)

router.get("/blogs", mw.authorization, blogController.getBlogs)

router.put("/blogs/:blogId", mw.authorization,  blogController.putBlog)

router.delete("/blogs/:blogId", mw.authorization, blogController.deleteBlog )

router.delete("/blogs", mw.authorization, blogController.blogByQuery)


module.exports = router;