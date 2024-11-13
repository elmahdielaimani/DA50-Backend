var express = require('express');
// var userModel = require('./userModel');
var userController=require('../src/User/userController.js');
const router=express.Router();

router.route('/user/login').post(userController.loginUserControllerFn);
router.route('/user/create').post(userController.createUserControllerFn);
router.route('/user/update/:id').patch(userController.updateUserControllerFn);
router.route('/user/getUser/:id').get(userController.getUserControllerFn);

module.exports=router;