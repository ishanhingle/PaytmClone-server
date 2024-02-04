const userModel=require('../Models/UserModel');
const accountsModel=require('../Models/AccountsModel');
const zod=require('zod');
const jwt=require('jsonwebtoken');

const signupSchema=zod.object({
    username:zod.string(),
    name:zod.string(),
    password:zod.string()
})

const signupUser= async (req,res,next)=>{
  const user=req.body
  const {success}=signupSchema.safeParse(user);
  if(!success) {res.json({message:"Email already taken/incorrect input"}); return;}
  const existingUser=await userModel.findOne({username:user.username});
  if(existingUser) {res.json({message:"Email already taken/incorrect input"}); return;}
  const dbUser=await userModel.create({...user});
  const userId=dbUser._id;
  const token=jwt.sign({userId},process.env.JWTSECRET);
  await accountsModel.create({
    userId,
    balance:Math.random()*1000+1
  })
  res.status(201).json({
   message:"User Created Successfully",
   token:token,
  })
}

const signinUser=async(req,res,next)=>{
  const { username, password } = req.body;
	if (!username || !password)
		return res
			.status(400)
			.json({ message: `All the fields are required.` });
  const signinSchema=zod.object({
    username:zod.string(),
    password:zod.string()
  })
  const {success}=signinSchema.safeParse(req.body);
  if(!success) {res.json({message:"Incorrect input"}); return;}
  const user=await userModel.findOne({username:username})
  if(!user || user.password!==password){
    return res.status(404).json({
      message:"invalid username or password"
    })
  }
  const userId=user._id;
  req.userId=userId
  const token=jwt.sign({userId},process.env.JWTSECRET);
  return res.status(200).json({
    message:"user signed in successfully",
    token:token,
  })
}


const updateUser=async(req,res,next)=>{
  const user=req.body;
  const {success}=signupSchema.safeParse(user);
   if(!success) res.json({message:"Email already taken/incorrect input"}); return;
   try {
    const updatedUser=await userModel.findOneAndUpdate({...user});
    res.status(200).json({
      sucess:true,
      message:"User Updated Successfully"
    })
   } catch (error) {
    console.log(error);
   }
}

const getUsers=async(req,res,next)=>{
  try {
    const name=req.query.name || "";
    console.log(name);
    const users=await userModel.find({
      name:{
        $regex:name
      }
    });
    res.status(200).json({
      users:users.map(user=>({
        name:user.name,
        username:user.username,
        id:user._id
       }))
    })
  } catch (error) {
    console.log(error);
  }
}

const getUser=async (req,res,next)=>{
  const user=await userModel.findOne({
    _id:req.userId
  })
  if(!user){
    res.status(404).json({
      message:"User not found"
     })
     return;
  }
  res.status(200).json({
    name:user.name,
    username:user.username,
    _id:user._id
  })
}

module.exports={
  signinUser,
  signupUser,
  getUser,
  getUsers,
  updateUser
}