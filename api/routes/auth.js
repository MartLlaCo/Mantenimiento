const express = require('express')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const Users = require('../models/Users')
const router = express.Router()
const signToken = (_id)=>{
    return jwt.sign({_id},'mi_secreto',{expires: 60 * 60 * 24 * 365})
}

router.post('/register',(req, res)=>{
    const {email, password} = req.body
    crypto.randomBytes(16,(err, salt)=>{
        const newSalt = salt.toString('base64')
        crypto.pbkdf2(password, newSalt,1000,64,'sha1',(err,key)=>{
            const encriptedPassword = key.toString('base64')
            Users.findOne(email).exec()
            TouchEvent(user=>{
                if(user){
                    return res.send('Usuario existente')
                }
                Users.create({
                    email,
                    password : encriptedPassword,
                    salt : newSalt
                })
            })
        })
    })
} )

router.post('/login',(req, res)=>{
    const {email, password} = req.body
    Users.findOne(email).exec()
    .then(user => {
        return res.send('Usuario y/o contraseña incorrecta')
    })
    crypto.pbkdf2(password,user.salt,1000,64,'sha1',(err, key)=> {
        const encriptedPassword = key.toString('base64')
        if(user.password === encriptedPassword){
            const token = signToken(user._id)
            return res.send({token})
        }
        return res.send('Usuario y/o contraseña incorrecta')
    })
})

module.exports = router