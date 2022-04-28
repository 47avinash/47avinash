const { default: mongoose } = require("mongoose")
const blogModel = require("../models/blogModel")


const createBlog = async function (req, res) {
  try {
    let blog = req.body;
    let authorId = req.body.authorId
    
    if(!mongoose.isValidObjectId(authorId)){
        return res.status(400).send({status : false, msg : "this is not a valid user id"})
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
      let verifyAuthor = mongoose.isValidObjectId(authorId)

      if(!verifyAuthor) {
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
      if (typeof(tags)!==[String]) {
        return res.status(400).send({ status: false, msg: 'this is not a valid tag' })
      }

      if (!await blogModel.exist(tags)) {
        return res.status(400).send({ status: false, msg: 'no blog with this tag exist' })
      }
    }

    if (subcategory) {
      if (typeof(subcategory) !== [String]) {
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
    } 
    else {
      return res.status(200).send({ status: true, data: getSpecificBlogs });
    }
} 
    catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};






const putBlog = async function (req, res) {

  try {
    let data = req.body

    let id = req.params.blogId 
    let authorId = req.query.authorId
    
    if(!id){ 
        return res.send("blogId must be present in request param ")
    }

    let xyz = await blogModel.findById(id)
    
    if(!mongoose.isValidObjectId(id)){
        return res.status(400).send({status: false, msg: "Please provide a Valid blogId"})
    }

    if(!authorId){
      return res.status(400).send({status:false, msg : "The authorId must be present"})
    }

    if(!mongoose.isValidObjectId(authorId)){
        return res.status(400).send({status: false, msg: "Please provide a Valid authorId"})
    }
    
    if(!xyz){
        return res.status(400).send({status: false, msg : "No Blog with this Id exist"})
    }

    let updatedBlog = await blogModel.findOneAndUpdate({ _id: id }, { $set: data }, { new: true })
    if (!updatedBlog) {
        return res.status(404).send({ msg: "we are not  able to update it " })
    }
    else{ 
        return res.status(200).send({ msg: updatedBlog })
    }
  }
  catch (error) {
    res.status(500).send(error.message)
  }
}






const deleteBlog = async function (req, res) {
  try {
    let blog = req.params.blogId
    let authorId = req.query.authorId
    
    if(!blog){
        return res.status(400).send({status : false, msg : "blogId must be present in order to delete it"})
    }
       
    if(!mongoose.isValidObjectId(blog)){
        return res.status(400).send({status: false, msg: "Please provide a Valid blogId"})
    }

    if(!mongoose.isValidObjectId(authorId)){
        return res.status(400).send({status: false, msg: "Please provide a Valid authorId"})
    }
    
    if(decodeToken.authorId != data.authorId){
        return res.status(400).send({status:false, msg :"You are not authorized to do this"})
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


const blogByQuery = async (req, res) =>{
  try {
    const data = req.query;
    const authorId = req.query.authorId
    
    if(!mongoose.isValidObjectId(authorId)){
        return res.status(400).send({status: false, msg: "Please provide a Valid authorId"})
    }
    
    if(decodeToken.authorId != data.authorId){
        return res.status(400).send({status:false, msg :"You are not authorized to do this"})
    }
    
    if (Object.keys(data) == 0){    
      return res.status(400).send({ status: false, message: "No input provided" });
    }
    const deleteByQuery = await blogModel.updateMany(data,{ isdeleted: true, deletedAt: new Date() },
      { new: true }               
    );
    if (!deleteByQuery){
      return res.status(404).send({ status: false, message: "No such blog found" });
    } 
    else{
    res.status(200).send({ status: true, message: deleteByQuery })
    }
} 
  catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};



module.exports = { createBlog, getBlogs, putBlog, deleteBlog, blogByQuery }
