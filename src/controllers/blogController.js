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
            authorId,
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

       if(findBlogs){
           return res.status(200).send({status : true, msg : " these are the blogs related to your query", data : findBlogs})
       }
       
    }

    catch(err){
        res.status(500).send({status : false, msg : err.message })
    } 
}

module.exports = {createBlog, getBlogs}