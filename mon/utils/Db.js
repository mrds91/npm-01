const userModel = require("../model/user");
const auth = require("../utils/Auth");

var updateUser = function(request, response){
    var usernameParam = (request.params.username || request.query.username)
    var isUserNameError = !!request.body.username
    var isRoleUpdateAttemptError = false
    if(usernameParam)
      usernameParam = usernameParam.replace(/\"/g, '').replace(/\'/g, '')
    var updateQuery = request.body;
    delete updateQuery.username;
    if(request.body.role)
      if(!auth.isAdmin(request, response)){
        delete updateQuery.username;
        isRoleUpdateAttemptError = true
      }
 
  userModel.updateOne({username : usernameParam}, updateQuery , (err, doc)=>{
    if(err){
      console.log(err)
      return response.status(500).send({"code" : "500 - mdb", "message" : "error wwhile updating in backend"});
    }
    else{
      var errArr = []
      if(isUserNameError){
        errArr = errArr.push('username not updated and it cannot be')
      }
      if(isRoleUpdateAttemptError){
        errArr = errArr.push=('Role not updated and only admin can')
      }
      if(isUserNameError || isRoleUpdateAttemptError){
        doc.error = errArr
        return response.status(207).send(doc)
      }
      return response.status(200).send(doc)
    }
  } )
}
module.exports = {
    updateUser
}