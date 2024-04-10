const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const bodyparser=require('body-parser')
router.use(bodyparser.json())
const areaModel=require('../models/Area')
const userModel = require('../models/Users')

/**
 * @route POST Area/Insert
 * @description Adding Areas
 * @access Public
 */
router.post('/insert',async (req,res)=>{
    try{
       
        const Area=new areaModel({
            _id:req.body.areaID,
            name:req.body.areaName,
            city:req.body.areaCity,
            district:req.body.areaDistrict
            })
            
                
        const result=await Area.save()

        res.status(201).send(`A Area was added with the ID:${Area._id}`)
        
              
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



router.get('/',async (req,res)=>{
    await areaModel.find({}).then(Areas=>{
        if(Areas.length===0){
            res.status(404).send()
        }else{
            res.status(200).send(Areas)
        }
    }).catch(e=>{console.log(e);})
   
})

router.get('/countAreaWise',
async (req,res)=>{
  try {
    const Areas=await areaModel.find({})
    function AreaResp(areaID,areaName,userCount){
        this.areaId=areaID
        this.areaName=areaName
        this.userCount=userCount
    }
    const Arr=[]
    //Attaching a promise to each element in the Areas array
    //So that all the sync functions get completed
    const promises=Areas.map(async area=>{
        await userModel.find({areaID:area._id}).then(users=>{
            const arearesp=new AreaResp(area._id,area.name,users.length)
            Arr.push(arearesp)
        })       
        
    })

    Promise.all(promises).then(
     ()=>{
        res.status(200).send(Arr)
     }   
    ).catch(e=>{
        console.log(e);
    })

    
  }catch(e){
    console.log(e);
    res.status(500).send()
  }
})

module.exports=router
