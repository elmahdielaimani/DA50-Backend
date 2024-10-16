var express = require('express');
var userController=require('../src/User/userController.js');
const router=express.Router();

router.route('/user/login').post(userController.loginUserControllerFn);
router.route('/user/create').post(userController.createUserControllerFn);


module.exports=router;