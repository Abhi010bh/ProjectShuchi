const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const bodyparser=require('body-parser')
const connectDB=require('../../src/db/conn')
router.use(bodyparser.json())
const userModel=require('../models/Users')
const Area=require('../models/Area')

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
                res.status(200).send("Login successful");
            } else {
                res.status(202).send("Authentication failed");
            }
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred while finding user.");
    }
});

router.get('/',
            (req,res)=>{
               connectDB().then(db=>{
                const userData=db.collection('Shuchi').find({}).toArray().then(doc=>{
                    res.send(doc)
                }

                ).catch(
                    e=>{console.log(e);}
                )
               }
               ).catch(e=>
                {console.log(e);})
            })

router.delete('/deleteAll',async (req,res)=>{
    await userModel.deleteMany()
    console.log(userModel.find({}));
})


module.exports=router