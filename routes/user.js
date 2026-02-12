const express = require('express');
const router = express.Router();
const userController = require('../controller/userConroller');



router.get('/login', userController.loadLogin)

router.post('/login',userController.login)

router.get('/register', userController.loadRegister)

router.post('/register',userController.registerUser)

module.exports = router;