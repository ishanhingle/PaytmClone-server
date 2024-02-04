const mongoose=require('mongoose');
const UserSchema=new mongoose.Schema({
    username:{
        required:true,
        type:String
    },
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
})
module.exports=new mongoose.model("userModel",UserSchema);