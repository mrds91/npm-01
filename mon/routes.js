const express = require("express");
const userModel = require("./model/user");
const auth = require('./utils/Auth')
const db = require('./utils/Db')
const app = express();

  app.post("/mon/user", async (request, response) => {
    const user = new userModel(request.body);
    try {
      await user.save();
      response.send(user);
    } catch (error) {
      console.log(error)
      response.status(500).send(error);
    }
});

async function getByUserName(uname){
  const user = await userModel.findOne({username: uname})
  try{
      return user
  }
  catch(e){
    console.log(e)
    return e
  }
}

app.get("/mon/user/isavailalble", async(req, res) =>{
  un = req.query.username
  console.log("/mon/user/isavailalble -- " + un)
  un = un.replace(/\"/g, '').replace(/\'/g, '');
  let user = await getByUserName(un)
  var jsonRes = {}
  if(user != null){
    jsonRes['isAvailable'] = false
    res.send(jsonRes)
  }
  else{
    jsonRes['isAvailable'] = true
    res.send(jsonRes)
  }
})

app.post("/mon/authenticate", async (request, response) => {
  console.log(request.body)
  try{
    const user = await getByUserName(request.body.username);
    if(user){
      console.log(user.username)
      if(user.password === request.body.password){
        return response.send(user);
      }
      return response.status(401).send({"code" : "401 - nj", "message" : "Unauthorized - pw"});
    }
    else{
      console.log(4)
      return response.status(401).send({"code" : "401 - nj", "message" : "Unauthorized - un"});
    }
  } catch (error) {
    console.log(error)
    response.status(500).send(error);
  }
});

app.patch("/mon/user/:username", auth.authorize, async (request, response) => {
  var usernameParam = (request.params.username || request.query.username).replace(/\"/g, '').replace(/\'/g, '')
  var isUserNameError = !!request.body.username
  var isRoleError = !!request.body.role
  var updateQuery = request.body;
  delete updateQuery.username;
  delete updateQuery.role;
  userModel.updateOne({username : usernameParam}, updateQuery , (err, doc)=>{
    if(err){
      console.log(err)
      return response.status(500).send({"code" : "500 - mdb", "message" : "error wwhile updating in backend"});
    }
    else
    if(isUserNameError){
      doc.error='username not updated and it cannot be'
      return response.status(207).send(doc)
    }
    if(isRoleError){
      doc.error='role not updated. Only admin can'
      return response.status(207).send(doc)
    }
    return response.send(doc)
  } )
})


app.patch("/mon/userd/:username", auth.authorize, async (request, response) => {
  try{
    db.updateUser(request, response)
  }
  catch(err){
      console.log(err)
      return response.status(500).send({"code" : "500 - mdb", "message" : "Internal server error"});
  }
})

app.delete("/mon/user/", auth.authorizeAsAdmin , async (request, response) => {
  var usernameParam = (request.query.username)
  if(usernameParam)
  usernameParam = usernameParam.replace(/\"/g, '').replace(/\'/g, '')
  userModel.deleteOne({username : usernameParam}, (err, doc)=>{
    if(err){
      console.log(err)
      return response.status(500).send({"code" : "500 - mdb", "message" : "error wwhile deleting in backend"});
    }
    else{
      console.log('Deleting - ' + usernameParam)
      return response.send(doc)
    }
      
  } )
})

app.get("/mon/users", auth.authorize , async (request, response) => {
  const users = await userModel.find({});

  try {
    response.send(users);
  } catch (error) {
    console.log(error)
    response.status(500).send(error);
  }
});

module.exports = app;