const User=require('../models/userModel')
const Owner=require('../models/ownerModel')

const sendTransaction=(req, res)=>{

    console.log(`Login Owner API hit`)
    try{
        const {email, password}=req.body

    }catch(error){
        res.status(400).send(error)
    }
}


const updateVacancy=(req, res)=>{

    console.log(`Login Owner API hit`)
    try{
        const {email, password}=req.body

    }catch(error){
        res.status(400).send(error)
    }
}

const addParkingLot=(req, res)=>{

    console.log(`Login Owner API hit`)
    try{
        const {email, password}=req.body

    }catch(error){
        res.status(400).send(error)
    }
}

module.exports={
    sendTransaction,
    addParkingLot,
    updateVacancy
}