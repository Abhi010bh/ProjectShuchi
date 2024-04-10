const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const Area=require('./Area')

const userSchema=new mongoose.Schema(
    {
        emailID:{type:String,required:true,unique:true},
        name:{
            firstName:{type:String,required:true},
            middleName:{type:String},
            lastName:{type:String,required:true}
        },
        Address:{
            houseNo:{type:String
            },
            street:{type:String},
            city:{type:String},
            district:{type:String},
            state:{type:String},
            pin:{type:Number},
            
        },
        houseID:{type:String,required:true,unique:true},
        areaID:{type:String,ref:'Area',unique:false},
        accessLevel:{type:String,
                     enum:['admin','driver','user'],
                    default:'user'},
        password:{type:String,
                required:true,
                unique:true}
        
    }
)

//using schema.pre to hash passwords
userSchema.pre('save',async function(next){
    const salt=await bcrypt.genSalt()
    this.password=await bcrypt.hash(this.password,salt)
    next()
})



const userModel=new mongoose.model('User',userSchema)

module.exports=userModel