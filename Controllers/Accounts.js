const accountsModel=require('../Models/AccountsModel');
const mongoose=require('mongoose')
const getBalance=async(req,res,next)=>{
    const user=await accountsModel.findOne({
       userId:req.userId
    })
    if(!user) res.status(404).json({messasge:"User dosen't exists"})
    else{
      res.status(200).json({
        balance:user.balance
      })  
    }
}

const transferMoney= async(req,res,next)=>{
    try {
        const session=await mongoose.startSession();
        session.startTransaction();
        const {amount,toUserId}=req.body;
        if ( !amount ||  !toUserId ||amount <= 0) return res.status(402).json({ message: `Invalid request.` });
        const toUserAccount=accountsModel.findOne({userId:toUserId}).session(session);
        if(!toUserAccount){
            session.abortTransaction();
            res.status(404).json({
                messasge:"Invalid Account"
            })
            return;
        }
        const fromAccount=await accountsModel.findOne({userId:req.userId}).session(session);
        if(!fromAccount){
            session.abortTransaction();
            res.status(404).json({
                messasge:"Invalid Account"
            })
            return;
        }
        if(amount>fromAccount.balance){
            session.abortTransaction();
            res.status(400).json({
                messasge:"Insufficient balance"
            })
            return;
        }
        //money transfer
    
        await accountsModel.updateOne({
            userId:req.userId
        },
        {$inc:{
            balance:-amount
        }}).session(session)
        await accountsModel.updateOne({
            userId:toUserId
        },
        {$inc:{
            balance:amount
        }}).session(session)
        
        //commiting transaction
        await session.commitTransaction();
    
        return res.status(200).json({
            message: `Transaction successful.`,
        });
    
    } catch (error) {
        res.status(400).json(error)
    }
}

module.exports={transferMoney,getBalance}
