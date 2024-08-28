const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);

router.get('/users',userController.getAllusers)

router.get('/users/:company_id', userController.getUserByCompanyId);

router.post('/login', userController.loginUser)

module.exports = router;
