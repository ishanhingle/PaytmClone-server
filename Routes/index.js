const express=require('express');
const router =express.Router();
const userRouter =require('./userRouter');
const accountsRouter=require('./accountsRouter');

router.use('/user',userRouter);
router.use('/accounts',accountsRouter);

module.exports=router