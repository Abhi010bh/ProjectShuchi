const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const bodyparser=require('body-parser')
const connectDB=require('../../src/db/conn')
router.use(bodyparser.json())
const userModel=require('../models/Users')
const Area=require('../models/Area')
const jwt=require('jsonwebtoken')
const authenticate=require('../controllers/auth.middleware')
const DateTime=require('date-and-time')
/**
 * @route POST User/SignUP
 * @description Authorising/Signing the user
 * @access Public
 */
router.post('/register',async (req,res)=>{
    try{
        
        const areaExists=await Area.findById(req.body.areaID)

        //Enforcing Referential integrity constraint using areaID
        if(!areaExists){
            return res.status(400).send({message:"Referenced area doesn't exists"})
        }

        //after integrity constraint has been passed
        const user=new userModel({
            emailID:req.body.emailID,
            name:{  firstName:req.body.name.firstName,
                    middleName:req.body.name.middleName,
                    lastName:req.body.name.lastName},
            Address:{
                    houseNo:req.body.Address.houseNo,
                    street:req.body.Address.street,
                    city:req.body.Address.city,
                    district:req.body.Address.district,
                    state:req.body.Address.state,
                    pin:req.body.Address.pin,
                   },
            houseID:req.body.houseID,
            areaID:req.body.areaID, 
            accessLevel:req.body.accessLevel,
            password:req.body.password,
            })
            
                
        const result=await user.save()
        
        res.status(201).send(`A profile was added with the user ID:${result._id}`)
        
              
    }catch(e){
        if(e.code===11000){
            console.log(e)
            res.status(500).send("Unique fields violated")
        }
        else{
            console.log(e);
            res.status(500).send(e.message).json()
        }
        
    }
})

/**
 * @route POST User/login
 * @description Authorising/Signing the user
 * @access Public
*/
router.post('/login', async (req, res) => {
    try {
        const user = await userModel.findOne({ emailID: req.body.emailID });
        
        if (user) {
            const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
            //compare requested password with hashed password
            
            if (isPasswordValid) {
                const token=jwt.sign({emailID:user.emailID,timeStamp:Date.now},'secret-key',{expiresIn:'1h'})
                res.status(200).json({token: token,
                    expiresIn: 3600,
                    emailID:user.emailID}); 
            } else {
                res.status(202).json({error:"Authentication failed"});
            }
        } else {
            res.status(404).json({error:"User not found"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Error occurred while finding user."});
    }
});

router.get('/',authenticate,
            async (req,res)=>{
              try {
                await userModel.find({}).then(users=>{
                    const responseMessage={
                        UserCount:users.length
                    }
                    res.status(200).send(responseMessage)
                })
                 
              }catch(e){
                console.log(e);
                res.status(500).send()
              }
            })


router.delete('/deleteAll',async (req,res)=>{
    await userModel.deleteMany()
    console.log(userModel.find({}));
})


module.exports=router