//libraries
require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const jwt=require('jsonwebtoken');
const bodyparser=require('body-parser');
const app=express();

app.listen(process.env.PORT,()=>{
    console.log("server started");
})

app.use(cors());
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.json());

//Routing
const mainRouter=require('./Routes/index');
app.use('/api/v1',mainRouter);
mongoose.connect(process.env.MONGOURL).then(console.log("database connected"));



