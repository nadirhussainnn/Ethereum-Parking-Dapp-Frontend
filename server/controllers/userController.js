const dotenv=require('dotenv')
dotenv.config()

const User=require('../models/userModel')
const Owner=require('../models/ownerModel')

const ParkingABI = require("./ABI.json");
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const INFURANET_URL= process.env.INFURANET_URL;
const web3 = new Web3(INFURANET_URL);

const login=(req, res)=>{

    console.log(`Login API hit`)
    try{
        const {email, password}=req.body

    }catch(error){
        res.status(400).send(error)
    }
}

const register=(req, res)=>{

    console.log(`Login API hit`)
    try{
        
        const {email, password, publicAddress, privateAddress}=req.body

    }catch(error){
        res.status(400).send(error)
    }
}

module.exports={
    login,
    register
}