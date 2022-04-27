const authorModel = require("../models/authorModel")


const createAuthor = async function(req,res){
    try{
        const requestData = req.body
        const {email} = requestData

        if( await authorModel.findOne({email: email})){
            return res.status(400).send({status : false, msg : "this email is already being used, please try login-in"})
            }

        else{
            let authorCreated = await authorModel.create(requestData)
            return  res.status(201).send({status : true, data : authorCreated})
            }
        }
    catch(err){
        res.status(500).send({status : false, msg : err.message })
    }
}

module.exports = {createAuthor}