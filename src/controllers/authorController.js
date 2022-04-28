const authorModel = require("../models/authorModel")
const validator = require('email-validator')
const jwt = require("jsonwebtoken")

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


const logInUser = async function (req, res){
    try{ 

     const username = req.body.email
     const password = req.body.password

     const verify = validator.validate(username)

     if(!verify){
         return res.status(400).send({status: false, msg : "This is not a Valid Username"})
     }

     if(!await authorModel.findOne({email : username})){
         return res.status(400).send({status : false, msg : "No user exists with this email"})
     }

     if(!password){
         return res.status(400).send({status : false, msg : "Password is required"})
     }
      
     let author =  await authorModel.findOne({email : username, password: password})

     if(!author){
         return res.status(400).send({status : false, msg: "Password is wrong"})
     } 

      let secretKey = 'I thought i was smarter to do this-yet i did it anyway'
      let token = jwt.sign({
         authorId : author._id,
         project : "blogging-site",
         batch : "uranium",
         group : 49
     }, secretKey);

     res.setHeader("x-api-key", token)
     res.status(200).send({status : true, msg : "logIn Successfull", data : token})

    }
    catch(err){
        return res.status(500).send({status: false, err : err.message})
    }
}
module.exports = {createAuthor, logInUser}