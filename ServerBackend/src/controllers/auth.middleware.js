const jwt=require('jsonwebtoken')
const userModel = require('../models/Users')
module.exports=(req,res,next)=>{
    try {
        const token=req.headers.authorization.split(" ")[1]
        const decoded=jwt.verify(
            token,
            "secret-key"
        )
        req.userData={
            emailID:decoded.emailID
        }
        next()
    } catch (error) {
        console.log(error);
        res.status(401).json({error:'Authentication failed'})
    }
}