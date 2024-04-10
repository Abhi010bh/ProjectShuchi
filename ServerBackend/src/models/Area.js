const mongoose=require('mongoose')

const areaSchema=new mongoose.Schema(
    {
        _id:{type:String,required:true},
        name:{type:String,required:true},
        city:{type:String,required:true},
        district:{type:String,required:true},
    }
)

const areaModel=new mongoose.model('Area',areaSchema)
module.exports=areaModel