const mongoose=require('mongoose');
const accountsSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userModel',
        required:true,
    },
    balance:{
        type:Number,
        required:true,
    }
})
module.exports=mongoose.model('accounts',accountsSchema)