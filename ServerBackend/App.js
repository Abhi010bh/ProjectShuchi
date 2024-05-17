const express=require('express')
const bodyparser=require('body-parser')
const dotenv=require('dotenv').config()
const cors=require('cors')
const app=express()
const Area=require('./src/routes/Area')
const Users=require('./src/routes/Users')
const bcrypt=require('bcrypt')
app.use(cors({origin:true,credentials:true}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const printConsole=require('./src/db/conn.js')
const connectDB=require('./src/db/conn.js')
const Profile=require('./src/routes/Profiles')

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
});

const port= process.env.PORT || 8000
const status={
    Status:"Disabled",
    PortNo:null,
   }
   
app.use('/Area',Area)
app.use('/User',Users)
app.use('/Profile',Profile)



app.listen(port,'0.0.0.0',()=>{
    status.Status="Listening"
    status.PortNo=port
    console.log(`App listening on ${status.PortNo}`);
    connectDB()
})
