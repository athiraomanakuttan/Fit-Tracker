const express = require('express');
const router = express.Router();
const loginController = require('../Controller/loginController');
const userController = require('../Controller/userController')
const { isLogined,checkLogin }= require('../Middleware/isLogined')


// ------------------ Login ---------------------------- 
router.get('/',checkLogin, loginController.loginPage);
router.post('/login',loginController.userLogin)

// ------------------ Sign up ---------------------------- 
router.get('/sign-up',checkLogin,loginController.signupPage)
router.post('/signup',loginController.signupUser)

// ------------------------- Home page ------------------- 
router.get('/home-page',isLogined,loginController.homepage)


// ---------------------- basic home function ------------------ 
router.get('/check-profile',isLogined,loginController.checkProfile)
router.post('/additional-details',isLogined,loginController.additionalData)


// ------------------------- Advanced features ----------------- 

router.get('/bmi-details',isLogined,userController.bmiDetails)
router.get('/get-BMI-report',isLogined,userController.getBmiDetails)
router.get('/get-calorie-details',isLogined,userController.getCalorieDetails)
router.get('/get-calorie-data',isLogined,userController.getCaloriData)
module.exports = router;