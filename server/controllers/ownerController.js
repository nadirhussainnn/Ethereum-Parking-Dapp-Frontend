const Owner=require('../models/ownerModel')

const login=(req, res)=>{

    console.log(`Login Owner API hit`)
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