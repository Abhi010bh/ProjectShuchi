const mongoose=require('mongoose')
const Users=require('./Users')

const profileSchema=new mongoose.Schema(
    {
        userID:{type:String,ref:'Users',required:true,unique:true},
        dailyRatings:[{
            date:{type:Date,default:Date.now()},
            rating:{type:Number,required:true}
        }]
        
    }
)

const profileModel=mongoose.model('Profile',profileSchema)
module.exports=profileModel