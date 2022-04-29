const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const secretKey = 'I thought i was smarter to do this-yet i did it anyway'

const authorization = function (req,res,next){
    try{
        let token = req.headers['x-api-key']
        
        if(!token){
            return res.status(400).send({status : false, msg : "neccessary header token is missing"})
        }

        let decodeToken = jwt.verify(token, secretKey)
        if(!decodeToken){
            return res.status(400).send({status : false, msg : "this is an invalid token"})
        }

        let authorId = req.body.authorId || req.params.authorId || req.query.authorId
        
        if(!authorId){
            return res.status(400).send({status: false, msg : "AuthorId is required to do this action"})
        }

        if(! mongoose.isValidObjectId(authorId)){
            return res.status(400).send({status: false, msg : "this is not a valid author Id"})
        }

        if(decodeToken.authorId !== authorId){
            return res.status(400).send({status: false, msg : "You aren't not authorized to do this"})
        }

        next()
    }

    catch(err){
      return res.status(500).send({status : false, err : err.message})
    }
}

module.exports = {authorization}