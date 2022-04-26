const authorModel = require("../models/authorModel")


const createAuthor = async function(req,res){
    try{
        const requestData = req.body

        if(!req.body.email){
            res.status(400).send({status : false, msg : "The email must be present"})
        }
        else{
            if( await authorModel.find({email : req.body.email})){
            res.status(400).send({status : false, msg : "this email is already being used, please try login-in"})
            }
            else{
            let authorCreated = await authorModel.create(requestData)
            res.status(201).send({status : true, data : authorCreated})
            }
        }
    }
    catch(err){
        res.status(500).send({status : false, data : err.message })
    }
}

module.exports = {createAuthor}