const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const bodyparser = require('body-parser')
const connectDB = require('../../src/db/conn')
router.use(bodyparser.json())
const userModel = require('../models/Users')
const Area = require('../models/Area')
const jwt = require('jsonwebtoken')
const userAuthenticate = require('../controllers/auth.middleware')
const adminAuthenticate = require('../controllers/adminAcc.middleware')
const DateTime = require('date-and-time')
const profileModel = require('../models/Profiles')
const areaModel=require('../models/Area')

/**
 * @route POST User/register
 * @description Registering a new user.
 * @access Public
 * @middleware adminAuthenticate
 */
router.post('/register', adminAuthenticate, async (req, res) => {
    try {

        console.log(req.body)
        const areaExists = await Area.findById(req.body.areaID);
        console.log(`${areaExists} ${req.body.areaID}`);

        //Enforcing Referential integrity constraint using areaID
        if (!areaExists) {
            console.log(`${areaExists} ${req.body.areaID}`);
            return res.status(400).send({ message: "Referenced area doesn't exists" })
        }

        //after integrity constraint has been passed
        const user = new userModel({
            emailID: req.body.emailID,
            name: {
                firstName: req.body.name.firstName,
                middleName: req.body.name.middleName,
                lastName: req.body.name.lastName
            },
            Address: {
                houseNo: req.body.Address.houseNo,
                street: req.body.Address.street,
                city: req.body.Address.city,
                district: req.body.Address.district,
                state: req.body.Address.state,
                pin: req.body.Address.pin,
            },
            houseID: req.body.houseID,
            areaID: req.body.areaID,
            accessLevel: req.body.accessLevel,
            password: req.body.password,
        })


        await user.save().then(async (result)=>{
            const profile=new profileModel({
                userID:req.body.emailID
            })
            await profile.save().then(profile=>{
                res.status(201).send(`User ID:${result._id} Profile ID:${profile._id} was created successfully`)
            })

            
        })

        

        
    } catch (e) {
        console.log(e)
        if (e.code === 11000) {
            console.log(e)
            res.status(500).send("Unique fields violated")
        }
        else {
            console.log(e);
            res.status(500).send(e.message).json()
        }

    }
})

/**
 * @route POST User/login
 * @description Authorising/Signing the admin
 * @access Public
*/
router.post('/login', async (req, res) => {
    try {
        const user = await userModel.findOne({ emailID: req.body.emailID });

        if (user) {

            const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
            //compare requested password with hashed password

            if (isPasswordValid) {
                const token = jwt.sign({ emailID: user.emailID, timeStamp: Date.now(), accessLevel: user.accessLevel }, 'secret-key', { expiresIn: '1h' })
                res.status(200).json({
                    token: token,
                    expiresIn: 3600,
                    emailID: user.emailID,
                });
            } else {
                res.status(401).json({ error: "Authentication failed" });
            }
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error:
                "Error occurred while finding user."
        });
    }
});


/**
 * @route GET User/
 * @description Get the count of registered users.
 * @access Protected
 * @middleware userAuthenticate
 */
router.get('/', userAuthenticate,
    async (req, res) => {
        try {
            await userModel.find({}).then(users => {
                const responseMessage = {
                    UserCount: users.length
                }
                res.status(200).send(responseMessage)
            })

        } catch (e) {
            console.log(e);
            res.status(500).send()
        }
    })


    /**
     * @route GET User/:ID
     * @description Get the requested users profile
     * @access Protected to User
     * @middleware userAuthenticate
     */

router.get('/:Id',userAuthenticate,
    async (req,res)=>{

        try{
            
            await userModel.findOne({emailID:req.params.Id}).then(async (user)=>{
                await profileModel.findOne({emailID:req.params.Id}).then(profile=>
                    {   user.profile=profile
                        
                    }
                        
                )
                res.status(200).json(user)
                
            })            
        }catch (e){
            console.log(e);
            res.status(500).send()
        }
    })





/**
 * @route DELETE User/deleteAll
 * @description Delete all users (for testing purposes).
 * @access Protected
 * @middleware adminAuthenticate
 */
router.delete('/deleteAll', async (req, res) => {
    await profileModel.deleteMany()
    console.log(profileModel.find({}))
})


module.exports = router