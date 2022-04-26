const blogModel = require("../models/blogModel")

const createBlog = async function(req,res){
    try{ 
        
    }
    catch (err){
        res.status(500).send({status: false, err: err.message})
    }
}