const express = require('express');
const router = express.Router();
// let AdminController = require('../controller/AdminController')
let userController = require('../controller/userController');
let Authentication = require('../middlewares/tokenAuthentication');
let AuthController = require('../controller/AuthenticationController');
let MailController = require('../controller/MailController');
let MailConfigurationController = require('../controller/MailConfigurationController');
//SuperAdmin Creation
// router.post('/admin/create', AdminController.createAdmin);
//login
router.post('/user/authenticate',AuthController.authentication)
//user CRUD
router.post('/create/user', userController.createUser);
router.get('/users/list', Authentication,userController.getAllUsers);
//Email sending
router.post('/mail/send',Authentication,MailController.send);
//Mail Configuration CRUD
router.post('/create/mailconfiguration',Authentication,MailConfigurationController.createConfiguration);
router.post('/verifyotp',Authentication,MailConfigurationController.verifyOtp);
module.exports = router;