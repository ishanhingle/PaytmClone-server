const express=require('express');
const router=express.Router();
const userModel=require('../Models/UserModel');
const zod=require('zod');
const jwt=require('jsonwebtoken');
const {signupUser,updateUser,signinUser,getUser,getUsers}=require('../Controllers/User');
const authMiddleware = require('../Middleware/Auth');



router.post('/signup',signupUser);
router.post('/signin',signinUser);

router.get('/',authMiddleware,getUser);
router.get('/bulk',authMiddleware,getUsers);
router.put('/update',authMiddleware,updateUser);

module.exports=router