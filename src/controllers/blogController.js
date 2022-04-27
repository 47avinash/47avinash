const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")


const createBlog = async function (req, res) {
    try {
      let blog = req.body;

      if(!blog){
          return   res.status(400).send({status:false,msg:"BAD REQUEST"});
      }



      if (blog) {
        let author = await authorModel.find({ _id: blog.authorId });
        if (author.length != 0) {
          let blogCreated = await blogModel.create(blog);
  
          if (blog.isPublished === true) {
            let mainBlog = await blogModel.findOneAndUpdate(
              { _id: blogCreated._id },
              { $set: { publishedAt: Date.now() } },
              { new: true }
            );
            return res.status(201).send({status:true, data: mainBlog });
          }
          return res.status(201).send({status:true, data: blogCreated });
        } else {
          return res.status(404).send({status:false,msg:"Author does not exist"});
        }
      } else {
      //  res.status(400).send({status:false,msg:"BAD REQUEST"});
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




const putBlog = async function(req,res){
    try{
        let blog = req.params._id
         let data =req.body
        if(blog==0){
            return res.status(400).send({status : false, msg : "the blog id must be present"})
        }

        if(! await blogModel.exists(blog)){
            return res.status(400).send({status : false, msg : "Blog Id is not valid"})
        } 

       // const { title, body, tags, subcategory} = req.body

        //we use find().updateMany( ) in below line

        const update = await blogModel.find({ blogs:blog}).updateMany({$in:data},{$set:{new:true}},{multi:true})
            
         //    {$or : [{title : title,new:true}, {body : body,new:true},{tags: tags,new:true}, {subcategory: subcategory,new:true}]})
        
        if(update){
            res.status(200).send({status : true, data: update})
        }

    }
    catch(err){
        res.status(500).send({status : false, msg : err.message })
    } 
}


const deleteBlog = async function(req,res){
    try{
        let blog = req.params.blogId

        if(!req.params.blogId){
            return res.status(400).send({status : false, msg : "the blog id must be present"})
        }
        
        if(! await blogModel.exists(blogId)){
         return res.status(400).send({status: false, msg : "No blog exists bearing this Blog Id, please provide another one"})
        }

        // we replace findone() by find()

        const delted = await blogModel.find({'_id': blogId}).update({isDeleted: true}, {new: true})
        
        if(update){
            res.status(200).send({status : true, msg: delted})
        }

    }
    catch(err){
        res.status(500).send({status : false, msg : err.message })
    } 

}




const blogByQuery = async function(req,res){
    try{
        const { category, 
            authorId, 
            tags, 
            subcategory, 
            isPublished} = req.query

        const blog =  await blogModel.find({$or: [{category : category}, {author : authorId}, {tags : tags}, {subcategory: subcategory}, {isPublished : isPublished} ]}).updateMany({isDeleted : true}, {new : true})

        if(blog){
          return  res.status(200).send({status : true, msg : "Document deleted successfully", deletedDoument : blog})
        } else{
           return res.status(404).send({status : false, msg : "Could not find any document related to your query"})
        }
    }
    catch(err){
        res.status(500).send({status : false, msg : err.message })
    } 
}

module.exports = {createBlog, getBlogs, putBlog, deleteBlog, blogByQuery}
