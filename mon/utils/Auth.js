require('dotenv').config()
var http = require('http');
const jwt = require('jsonwebtoken')

const authorize = function authorization(req, res, next){
    var authHeader = req.headers['authorization']
    var token  = authHeader && authHeader.split(' ')[1];
    if(!token)
    return res.status(401).json({code:401,message:'No session found'}).end()
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
      if(err) {
        handleTokenError(err, res)
      }
      var userNameParam = (req.params.username || req.query.username)
      if(!userNameParam  || data.username === userNameParam.replace(/\"/g, '').replace(/\'/g, '')){
      req.authData = data
      next()
      }
      else
      return res.status(403).json({code:403,message:'Forbidden - onr-msmtch'}).end()
    })
  }
  


  const authorizeAsAdmin = function authorization(req, res, next){
    if(isAdmin(req,res))
      next()
    else 
      return res.status(403).json({code:403,message:'Forbidden - elvtn rqrd'}).end()
  }

  function isAdmin(req, res){
    var authHeader = req.headers['authorization']
    var token  = authHeader && authHeader.split(' ')[1];
    if(!token)
    return res.status(401).json({code:401,message:'No session found'}).end()
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
      if(err)
        handleTokenError(err, res)
      if(data.role > 0){
        req.authData = data
        return true;
      }
      else
      return false
    })
  

  }

  function handleTokenError(err, res){
    if(err.name === 'TokenExpiredError')
        return res.status(401).json({code:401,message:'unauth-exp'}).end()
        if(err.name === 'JsonWebTokenError' || err.name === 'SyntaxError')
        return res.status(401).json({code:401,message:'unauth-tmprd'}).end()
        return res.status(401).json({code:401,message:'unauth-cntvrfy'}).end()
  }

  const verifyCredentials = function verifyUser(req){
    var postData = JSON.stringify(req.body)
    var options  = { hostname: `localhost`, port: process.env.API_PORT, path: '/mon/authenticate', method: 'POST',
          headers: {
               'Content-Type': 'application/json',
               'Content-Length': postData.length
             } };
             let credentialVerificationResponse = ''
    return new Promise((resolve, reject)=>{
      var request = http.request(options,(response)=>{
        response.on('data', (d) => {
            credentialVerificationResponse = credentialVerificationResponse + d.toString();
        });
        response.on('end',()=>{
          var resObj = JSON.parse(credentialVerificationResponse)
            if(response.statusCode < 210 && (resObj)['username'] === req.body.username)
            {
              resolve(resObj)
            }
            else{
              resObj ?  reject(resObj) : reject('401')
            }
        });
        
      });
      request.on('timeout', () => {
        req.destroy()
        reject(new Error('Request time out'))
      });
      request.on('error', (e) => {
        reject(new Error('Internal server error'))
      });
    request.write(postData)
    request.end();
    })
  
  }

  module.exports = {
    authorize,
    verifyCredentials,
    authorizeAsAdmin,
    isAdmin
  }