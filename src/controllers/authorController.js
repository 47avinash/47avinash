const authorModel = require("../models/authorModel")
const validator = require('email-validator')

const createAuthor = async function(req,res){
    try{
        const requestData = req.body
        const {email} = requestData
          const verifyEmail =  validator.validate(email)
      
        if(!verifyEmail){
            return res.status(400).send({status:false,msg:'this is not a valid email'})
            }

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