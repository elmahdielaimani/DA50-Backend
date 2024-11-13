const userModel = require('./userModel');
var userService= require ('./userService');

var createUserControllerFn =async (req,res)=>
{
 try
 {
    console.log(req.body);
    var status=await userService.createUserDBService(req.body);
    console.log(status);
    if(status){
        res.send({"status":true,"message":"User created successfully"});
    }else{
        res.send({"status":false,"message":"error creating user"});
    }
    }
    catch(err){
        console.log(err)
    }
 }


 var loginUserControllerFn =async (req,res)=>
    {
        var result=null;
     try
     {
        result= await userService.loginUserDBService(req.body);
       
       
        if(result.status){
            res.send({
                "status":true,
                "message":result.msg,
                "token":result.token,
                "userId": result.userId
            });
        }else{
            res.send({"status":false,"message":result.msg});
        }
        }
        catch(error){
            console.log(error);
            res.send({"status":false,"message":error.msg});
        }
     }

     var getUserControllerFn = async (req, res) => {
        try {
            const user = await userService.getUserFromDBService(req.params.id);
            res.send({ "status": true, "data": user });
        } catch (error) {
            res.status(500).send({ "status": false, "message": "Error retrieving user data" });
        }
    };
    

     var updateUserControllerFn =async (req,res)=>
        {
           console.log(req.params.id);
           console.log(req.body);
        
          var result= await userService.updateUserDBService(req.params.id,req.body);
           
           
            if(result){
                res.send({"status":true,"message":"user updatedd"});
            }else{
                res.send({"status":false,"message":"user updatedd failed"});
            }
           
         }
        
    
    



 module.exports={createUserControllerFn ,loginUserControllerFn,updateUserControllerFn,getUserControllerFn};
