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
        
        const blogData = req.body
        if(! await blogModel.exists(blogData)){
            let blog =  await blogModel.create(blogData)
            return res.status(201).send({status : true, msg: "A new Blog has been successfully created", data : blog})
        }

        }
    catch(err){
        res.status(500).send({status : false, msg : err.message })
    } 
}

module.exports = {createBlog}