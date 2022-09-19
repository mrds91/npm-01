require('dotenv').config() 
var exp = require('express');
const auth = require('./utils/Auth')
var jwt = require('jsonwebtoken')


const cors=require("cors");


const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

var app = exp();
app.use(cors(corsOptions))
app.listen(process.env.AUTH_PORT,()=>{console.log(`Auth service running in http://localhost:${process.env.AUTH_PORT}`)})

app.use(exp.json())

app.post('/das/authenticate',  (req,res) =>{
  authenticateUser(req,res)
})


app.get('/das/authorize', auth.authorize,  (req,res) =>{
  res.send(req.authData)
})

async function authenticateUser(req, res){
  var authResponse = {}
  res.setHeader('content-type', 'application/json')
   try{
      authResponse =  await auth.verifyCredentials(req)
   }
  catch(e){
      if(e.code )
        return res.status(401).json(e).end()
      return res.status(500).json({code : 'Das - Auth - 500', message : 'Error while reaching backend'}).end()
   }
   try{
       var generatedToken = jwt.sign(authResponse, process.env.ACCESS_TOKEN_SECRET,{expiresIn:300})
       res.cookie('tmo_token', generatedToken)
       return res.send({token : generatedToken});
   }
   catch(e){
    console.log(e)
    return res.status(500).json({code : 'Das - Auth - 500', message : 'Internal server error'}).end()   }
}



