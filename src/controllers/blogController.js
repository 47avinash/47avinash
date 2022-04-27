const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")


const createBlog = async function(req,res){
    try{
         
    
        const author =  req.body.authorId
        if(author){
            if(! await authorModel.findById(author)){
              return res.status(400).send({status: false, msg : "An Author with this Id does not exist"})
            }
        }

        const blogData = {
            title,
            body,
            author,
            category,
            isPublished : isPUblished ? isPublished : false,
            publishedAt : isPublished ? new Date() : null

        }
        if(! await blogModel.exists(blogData)){
            let blog =  await blogModel.create(blogData)
            return res.status(201).send({status : true, msg: "A new Blog has been successfully created", data : blog})
        }

        }
        catch(err){
            res.status(500).send({status : false, msg : err.message })
        } 
}     

       


const getBlogs = async function (req,res){
    try{
       const requestBody = req.query
       const {authorId, category, tags, subcategory} = requestBody

       const findBlogs = await blogModel.findMany({$and : [{isDeleted : false}, {isPublished : true}]}).select({$or : [{author : authorId},{category : category},{tags : tags}, {subcategory : subcategory}]})

       if(!findBlogs){
           return res.status(404).send({status : false, msg : " these aren't any blogs related to your query"})
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
        let blog = req.params.blogId

        if(!blog){
            return res.status(400).send({status : false, msg : "the blog id must be present"})
        }

        if(! await blogModel.exists(blog)){
            return res.status(400).send({status : false, msg : "Blog Id is not valid"})
        } 

        const { title, body, tags, subcategory} = req.body
        
        const update = await blogModel.findOneAndUpdate({'_id' : blog}, {$or : [{title : title}, {body : body},{tags: tags}, {subcategory: subcategory}]})
        
        if(update){
            res.status(200).send({status : true, msg: update})
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

        const delted = await blogModel.findOne({'_id': blogId}).update({isDeleted: true}, {new: true})
        
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
           return res.status(400).send({status : false, msg : "Could not find any document related to your query"})
        }
    }
    catch(err){
        res.status(500).send({status : false, msg : err.message })
    } 
}

module.exports = {createBlog, getBlogs, putBlog, deleteBlog, blogByQuery}
