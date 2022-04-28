const { default: mongoose } = require("mongoose");
const {ignore } = require("nodemon/lib/rules");
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")


const createBlog = async function (req, res) {
    try {
      let blog = req.body;

      if(!blog){
          return res.status(400).send({status:false,msg:"BAD REQUEST"});
      }
      let author = await authorModel.find({ _id: blog.authorId })
      
      if(author.length === 0){
          return res.status(404).send({status:false,msg:"Author does not exist"})
      }

      let blogCreated = await blogModel.create(blog);
      
        if(blog.isPublished === true){
        let mainBlog = await blogModel.findOneAndUpdate(
            { _id: blogCreated._id },
            { $set: { publishedAt: Date.now() } },
            { new: true, upsert: true }
          );
          return res.status(201).send({status:true, data: mainBlog })
        } else{
          return res.status(201).send({status:true, data: blogCreated })   
        }

    } catch (err) {
      return res.status(500).send({status:false, err: err.message });
    }
}

       


const getBlogs = async function (req,res){
    try{
       const requestBody = req.query
       const {authorId, category, tags, subcategory} = requestBody

       const findBlogs = await blogModel.find({ isDeleted : false, isPublished : true}).select({authorId:1,category:1,tags:1,subcategory:1}) 

       if(!findBlogs){
           return res.status(400).send({status : false, msg : " these aren't any blogs related to your query"})
       }
       else{
           return res.status(200).send({status : true, msg : " these are the blogs related to your query", data : findBlogs}) 
        }
    }
    catch(err){
        res.status(500).send({status : false, msg : err.message })
    } 
}




const putBlog = async function (req, res) {
    try {
      let data = req.body;
      let blogId = req.params.blogId;
      let findBlog = await blogModel.findById(blogId);
      let verifyBlogId = blogId.trim()
      
      if(verifyBlogId.length === 0){
        return res.status(400).send({status: false, msg : "BlogId must be present"})
      }

    //   if(verifyBlogId.length !== 24){
    //     return res.status(400).send({status: false, msg : "This is not a valid BlogId"})
    //   }

      if(! await mongoose.isValidObjectId(verifyBlogId)){
        return res.status(400).send({status: false, msg : "This is not a valid BlogId"})
      }

      if(!findBlog){
          return res.status(400).send({status : false, msg : "Blog with this Blog Id does not exists"})
      }

      if(findBlog.isDeleted === true){
          return res.status(200).send({status: true, msg : "The Blog with this blogId has been deleted"})
      }

      if(findBlog.isPublished === false){
          return res.status(404).send({status : false, msg : "This Blog has not been Published yet"})
      }


      if(findBlog.isDeleted === false){
        if(findBlog.isPublished === true){
            let a = await blogModel.findOneAndUpdate(
                { _id: blogId },
                { $set: { isPublished: true, publishedAt: Date.now() } } )
      }
      let updatedBlog = await blogModel.findOneAndUpdate(
        { _id: blogId },
        { ...data },
        { new: true }
      )
        return res.status(200).send({ status : true, msg: "blog updated successfully", data : updatedBlog });
      }
        
    } catch (err) {
      return res.status(500).send({ status : false, err : err.message });
    }
  };
/*
let deleteBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    if (blogId) {
      let deletedBlog = await blogModel.findOneAndUpdate(
        { _id: blogId },
        { $set: { isDeleted: true }, deletedAt: Date.now() },
        { new: true }
      );
      console.log(deletedBlog);
      res.send(deletedBlog);
    } else res.status(400).send("BAD REQUEST");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

*/

const deleteBlog = async function(req,res){
    try{
        let blog = req.params.blogId
        let verifyId = blog.trim() 

        if(verifyId.length === 0){
            return res.status(400).send({status: false, msg : "BlogId must be present"})
        }
    
        if(verifyId.length !== 24){
            return res.status(400).send({status: false, msg : "This is not a valid BlogId"})
        }
    
        if(! await blogModel.findById(blog)){
         return res.status(400).send({status: false, msg : "No blog exists bearing this Blog Id, please provide another one"})
        }

        let deletedBlog = await blogModel.findOneAndUpdate(
            { _id: blog },
            { $set: { isDeleted: true }, deletedAt: Date.now() },
            { new: true }
          )
        
        if(deletedBlog){
            res.status(200).send({status : true, msg:"Your Blog has been successfully deleted", deletedData : deletedBlog})
        }

    }
    catch(err){
        res.status(500).send({status : false, msg : err.message })
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
    res.status(500).send({ ERROR: err.message });
  }
};
*/


const blogByQuery = async function(req,res){
    try{
        let data = req.query
        const { category, 
            authorId, 
            tags, 
            subcategory, 
            isPublished} = req.query
        
    
        let deletedBlog = await blogModel.updateMany(
            { $in: data },
            { $set: { isDeleted: true }, deletedAt: Date.now() },
            { new: true }
        )

        if(blog){
          return  res.status(200).send({status : true, msg : "Document deleted successfully", deletedDoument : deletedBlog})
        } else{
           return res.status(404).send({status : false, msg : "Could not find any document related to your query"})
        }
    }
    catch(err){
        res.status(500).send({status : false, msg : err.message })
    } 
}

module.exports = {createBlog, getBlogs, putBlog, deleteBlog, blogByQuery}
