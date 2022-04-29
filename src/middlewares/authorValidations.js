const {check, validationResult} = require("express-validator")

exports.validateAuthor = [check('fname') 
    .trim()
    .not()
    .isEmpty().withMessage('First Name is Missing')
    .isLength({ min: 3, max: 30 })
    .withMessage('Invalid First Name, Name must be within 3 to 30 characters long'),

    check('lname')
    .trim()
    .not()
    .isEmpty().withMessage('Last Name is Missing')
    .isLength({ min: 3, max: 30 })
    .withMessage('Invalid Last Name, Name must be within 3 to 30 characters long'),

    check('title')
    .trim()
    .not()
    .isEmpty().withMessage('title is Missing')
    .isLength({ min: 2, max: 4 })
    .withMessage(' titile must be within 2 to 4 characters long'),

    check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Email is Invalid'),

    check('password')
    .trim()
    .not()
    .isEmpty().withMessage('password is Missing')
    .isLength({ min: 6, max: 16})
    .withMessage(' Password must be within 6 to 16 characters long')]

exports.validate = function (req,res,next){
        const error = validationResult(req).array()
        if(!error.length) return next()

        res.status(400).send({status : false, msg: error[0].msg})
    }

    