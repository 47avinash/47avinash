const { default: mongoose } = require("mongoose");
const { ignore } = require("nodemon/lib/rules");
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")


const createBlog = async function (req, res) {
  try {
    let blog = req.body;

    if (!blog) {
      return res.status(400).send({ status: false, msg: "BAD REQUEST" });
    }
    let author = await authorModel.find({ _id: blog.authorId })

    if (author.length === 0) {
      return res.status(404).send({ status: false, msg: "Author does not exist" })
    }

    let blogCreated = await blogModel.create(blog);

    if (blog.isPublished === true) {
      let mainBlog = await blogModel.findOneAndUpdate(
        { _id: blogCreated._id },
        { $set: { publishedAt: Date.now() } },
        { new: true, upsert: true }
      );
      return res.status(201).send({ status: true, data: mainBlog })
    } else {
      return res.status(201).send({ status: true, data: blogCreated })
    }

  } catch (err) {
    return res.status(500).send({ status: false, err: err.message });
  }
}




const getBlogs = async function (req, res) {
  try {

    let data = req.query;
    let filter = {
      isDeleted: false,
      isPublished: true,
      ...data,
    };
    const { authorId, category, subcategory, tags } = data

    if (authorId) {

      let author = authorId.trim()
      let verifyAuthor = mongoose.isValidObjectId(author)

      if (author.trim() === 0) {

        return res.status(400).send({ status: false, msg: 'authorId must be present' })
      }


      if (verifyAuthor == false) {

        return res.status(400).send({ status: false, msg: 'this is not a valid authorId' })
      }
    }

    if (category) {

      let verifyCategory = await blogModel.findOne({ category: category })

      if (!verifyCategory) {

        return res.status(400).send({ status: false, msg: 'No such category  exist' })

      }


    }

    if (tags) {

      let check = tags.length

      if (check === -1 || check == undefined || check == null) {

        return res.status(400).send({ status: false, msg: 'this is not a valid tag' })


      }

      if (!await blogModel.exist(tags)) {

        return res.status(400).send({ status: false, msg: 'no blog with this tag exist' })
      }

    }

    if (subcategory) {

      let check = subcategory.length

      if (check === -1 || check == undefined || check == null) {

        return res.status(400).send({ status: false, msg: 'this is not a valid subcategory' })


      }

      if (!await blogModel.exist(subcategory)) {

        return res.status(400).send({ status: false, msg: 'no blog with this subcategory exist' })
      }
    }

    let getSpecificBlogs = await blogModel.find(filter);

    if (getSpecificBlogs.length == 0) {
      return res
        .status(400)
        .send({ status: false, data: "No blogs can be found" });
    } else {
      return res.status(200).send({ status: true, data: getSpecificBlogs });
    }
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const putBlog = async function (req, res) {

  try {

    let data = req.body

    let id = req.params.blogId 
    if (!id) res.send("blogId must be present in request param ")

    let xyz = await blogModel.findById(id)


    let updatedBlog = await blogModel.findOneAndUpdate({ _id: id }, { $set: data }, { new: true })

    if (!updatedBlog) res.status(404).send({ msg: "we are not  able to update it " })

    res.status(200).send({ msg: updatedBlog })
  }


  catch (error) {


    res.status(500).send(error.message)

  }
}



const deleteBlog = async function (req, res) {
  try {
    let blog = req.params.blogId
    let verifyId = blog.trim()

    if (verifyId.length === 0) {
      return res.status(400).send({ status: false, msg: "BlogId must be present" })
    }

    if (verifyId.length !== 24) {
      return res.status(400).send({ status: false, msg: "This is not a valid BlogId" })
    }

    if (! await blogModel.findById(blog)) {
      return res.status(400).send({ status: false, msg: "No blog exists bearing this Blog Id, please provide another one" })
    }
           
     let findBlog = await blogModel.findById(blog)

     if(findBlog.isdeleted===true){

      return res.status(404).send({status:false,msg:'this blog has been deleted by user'})
     }

    let deletedBlog = await blogModel.findOneAndUpdate(
      { _id: blog },
      { $set: { isdeleted: true }, deletedAt: Date.now() },
      { new: true }
    )

    if (deletedBlog) {
      res.status(200).send({ status: true, msg: "Your Blog has been successfully deleted", deletedData: deletedBlog })
    }

  }
  catch (err) {
    res.status(500).send({ status: false, msg: err.message })
  }

}

/*
let deletedByQueryParams = async function (req, res) {
  try {
    let data = req.query;

    if (data) {
      let deletedBlogsFinal = await blogModel.updateMany(
        { $in: data },
        { $set: { isDeleted: true }, deletedAt: Date.now() },
        { new: true }
      );

      res.status(200).send({ status: true, result: deletedBlogsFinal });
    } else {
      res.status(400).send({ ERROR: "BAD REQUEST" });
    }
  } catch (err) {
    res.status(500).send({ ERROR: err.message 
  */

const blogByQuery = async function (req, res) {
  try {
    let data = req.query
    const { category,
      authorId,
      tags,
      subcategory,
      isPublished } = req.query
      
      let blogId = req.query.blogId

      let findBlog = await blogModel.findById(blogId)

      if(findBlog.isdeleted===true){
 
       return res.status(404).send({status:false,msg:'this blog has been deleted by user'})
      }


    let deletedBlog = await blogModel.updateMany(
      { $in: data },
      { $set: { isDeleted: true }, deletedAt: Date.now() },
      { new: true }
    )

    if (deletedBlog) {
      return res.status(200).send({ status: true, msg: "Document deleted successfully", deletedDoument: deletedBlog })
    } else {
      return res.status(404).send({ status: false, msg: "Could not find any document related to your query" })
    }
  }
  catch (err) {
    res.status(500).send({ status: false, msg: err.message })
  }
}

module.exports = { createBlog, getBlogs, putBlog, deleteBlog, blogByQuery }
