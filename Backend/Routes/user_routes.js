const express = require('express');
const { register } = require('../Controller/register');
const { login } = require('../Controller/login');
const { logout } = require('../Controller/logout');
const authenticateUser = require('../middleware/authenticateUser');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const User = require('../models/user_model');
const { update_user } = require('../Controller/update');
const { profile } = require('../Controller/profile');
const { request_ } = require('../Controller/request');

//public routes
router.post('/register', upload.single('profile_photo') ,register );
router.post('/login', login);

//protected routes for user
router.get('/profile', authenticateUser, profile);
router.put('/profile/update', authenticateUser, upload.single('profile_photo'),update_user);
router.post('/request/provider', authenticateUser, request_);
router.get('/logout', authenticateUser , logout);





module.exports = router;
