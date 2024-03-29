//Route to handle Area related queries

const express=require('express')
const router=express.Router()

router.use(express.json())

var route
/**
 * @route GET Area/test
 * @description Testing the area route
 * @access Public
 */
router.get('/test',
            (req,res)=>{
                route='/Area/test'
                res.send(`<div style="color:green">Testing  ${route} </div>`)
            })


router.get('/',
            (req,res)=>{
                
            })


module.exports=router
