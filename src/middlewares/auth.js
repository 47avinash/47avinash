const jwt = require("jsonwebtoken")
const express = require("express")
const secretKey = 'I thought i was smarter to do this-yet i did it anyway'

const authorization = async function (req,res,next){
    try{
        let token = req.header['x-api-key'] || req.header['x-Api-key']
        
        if(!token){
            return res.status(400).send({status : false, msg : "header is required"})
        }

        let decodeToken = jwt.verify(token , secretKey)

        if(!decodeToken){
            return res.status(400).send({status : false, msg : "this is an invalid token"})
        }

        let authorId = req.body.authorId || req.query.authorId || req.params.authorId

        if(authorId != token.authorId){
            return res.status(400).send({status : false, msg : "You aren't a authorized user"})
        }
    }
    catch(err){
      return res.status(500).send({status : false, err : err.message})
    }
}