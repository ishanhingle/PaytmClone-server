const express=require('express');
const router=express.Router();
const authMiddleware=require('../Middleware/Auth');
const {getBalance,transferMoney}=require('../Controllers/Accounts')


router.get('/balance',authMiddleware,getBalance);
router.post('/transferMoney',authMiddleware,transferMoney);


module.exports=router;