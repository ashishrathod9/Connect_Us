const express = require('express');
const { register } = require('../Controller/register');
const { login } = require('../Controller/login');
const { logout } = require('../Controller/logout');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/register', upload.single('profile_photo') ,register );
router.post('/login', login);
router.get('/logout', logout);


module.exports = router;
