require('dotenv').config()
const exp  = require('express')
const mongoose = require("mongoose");
const Router = require("./routes")
const cors=require("cors");


const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
const app = exp();
app.use(cors(corsOptions)) // Use this after the variable declaration
app.use(exp.json());
app.use(Router)


app.listen(process.env.API_PORT, ()=>{console.log('up')})





mongoose.connect(
    'mongodb+srv://admin0:zVFaSbB8b18kIhu1@cluster0.hgxvfbz.mongodb.net/test?retryWrites=true&w=majority', 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );

  const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});