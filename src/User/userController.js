const userModel = require('./userModel');
var userService = require('./userService');

var createUserControllerFn = async (req, res) => {
    try {
        console.log(req.body);
        var status = await userService.createUserDBService(req.body);
        console.log(status);
        if (status) {
            res.send({ "status": true, "message": "User created successfully" });
        } else {
            res.send({ "status": false, "message": "error creating user" });
        }
    }
    catch (err) {
        console.log(err)
    }
};


var loginUserControllerFn = async (req, res) => {
    var result = null;
    try {
        result = await userService.loginUserDBService(req.body);


        if (result.status) {
            res.send({ "status": true, "message": result.msg, "token": result.token, "userId": result.userId });
        } else {
            res.send({ "status": false, "message": result.msg });
        }
    }
    catch (error) {
        console.log(error);
        res.send({ "status": false, "message": error.msg });
    }
};

var updateUserRoleControllerFn = async (req, res) => {
    try{
        console.log('Updating user\'s role');
        var role = await userService.updateUserRoleDBService(req.body);
        console.log('User\'s role updated : ', role );
        res.send({ status: true, message: "Updating role"})
    }
    catch (error) {
        console.error('Error updating role', error);
        res.send({ status: false, message: "Error updating role"})
    }
};

var deleteUserControllerFn = async (req, res) => {
    try{
        console.log('Deleting user');
        var user = await userService.deleteUserDBService(req.body);
        console.log('User has been deleted :', user);
        res.send({ status: true, message: "Deleting user"})
    }
    catch (error) {
        console.error('Error deleting user', error);
        res.send({ status: false, message: "Error deleting role"})
    }
}

// Get all users
var getAllUsersControllerFn = async (req, res) => {
    try {
        console.log('Fetching all users');
        const users = await userService.getAllUsersDBService();
        console.log('Fetched users : ', users);
        res.send({ status: true, data: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.send({ status: false, message: "Error fetching users" });
    }
};

// Get a user
var getUserControllerFn1 = async (req, res) => {
    try {
        // Retrieve the email from the query parameters (or use req.params if it's part of the URL)
        const email = req.params.email; // Assuming email is passed as a query parameter
        
        if (!email) {
            return res.status(400).send({ status: false, message: "Email is required" });
        }

        console.log('Fetching user info for email:', email);
        const user = await userService.getUserByEmailDBService(email);
        
        if (user) {
            console.log('Fetched user info: ', user);
            res.send({ status: true, data: user });
        } else {
            res.send({ status: false, message: "User not found" });
        }
        
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.send({ status: false, message: "Error fetching user info" });
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

module.exports = { 
    createUserControllerFn, 
    loginUserControllerFn, 
    updateUserRoleControllerFn,
    getAllUsersControllerFn, // The get all users function
    getUserControllerFn, // The get user info function
    deleteUserControllerFn,
    updateUserControllerFn,
    getUserControllerFn1
};



