const { jsonWebTokenError} = require('jsonwebTokenError')
const jwt = require('jsonwebtoken')
const Users = require('../models/Users')

const isAuthenticated = (req, res, next)=>{
    const token = req.headers.authorization
    if(!token){
        return res.sendStatus(403)
    }
    jwt.verify(token,'mi_secreto',(err,decode)=>{
        const { _id } = decode
        Users.findOne({_id}).exec()
        .then(user=>{
            req.user = user
            next()
        })
    })
}

module.exports = isAuthenticated