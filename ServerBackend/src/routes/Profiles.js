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
 * @route POST Profile/ProfileUpdate
 * @description Updating user profile cleanliness rating.
 * @access Protected
 * @middleware adminAuthenticate
 */
router.post('/ProfileUpdate', adminAuthenticate,
    async (req, res) => {
        console.log(req.body);
        try {
            const user = await profileModel.findOne({ emailID: req.body.userID });
            console.log(user);
            if (user) {
                

                if (!user.dailyRatings) {
                    user.dailyRatings = [];
                }

                user.dailyRatings.push({
                    date: req.body.date,
                    rating: req.body.rating
                });
                await user.save();
                console.log(user);
                res.status(200).send("Profile updated successfully.");
            } else {
                res.status(404).send("User not found.");
            }
        } catch (e) {
            console.log(e);
            res.status(500).send("Internal server error.");
        }
    })

    module.exports=router