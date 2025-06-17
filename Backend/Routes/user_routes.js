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
const authorizeAdmin = require('../middleware/authorizeAdmin');

//public routes
router.post('/register', upload.single('profile_photo') ,register );
router.post('/login', login);

//protected routes for Customer
router.get('/profile', authenticateUser, profile);
router.put('/profile/update', authenticateUser, upload.single('profile_photo'),update_user);
router.post('/request/provider', authenticateUser, request_);
router.get('/logout', authenticateUser , logout);

//protected routes for Admin
router.put('/admin/update', authenticateUser,authorizeAdmin, upload.single('profile_photo'),update_user);
router.get('/admin/all_customers' , authenticateUser, authorizeAdmin , async (req, res) => {
    try {
        const users = await User.find({ role: 'customer' });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error });
    }
});

router.get('/admin/all_providers' , authenticateUser , authorizeAdmin , async(req , res)=>{
    try{
        let providers= await User.find({role : 'provider' , status :'approved'});
        res.status(200).json(providers);
    }catch(error){
        res.status(500).json({ message: "Server Error"} , error);
    }
});
router.get('/admin/applications',authenticateUser , authorizeAdmin , async (req , res)=> {
    try{
        let providers = await User.find({ role: 'provider' , status: 'inqueue' });
        res.status(200).json(providers);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching provider applications', error });
    }
    

});
router.put('/admin/approve/:id', authenticateUser, authorizeAdmin, async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);

    if (!user || user.role !== 'provider') {
      return res.status(404).json({ message: 'Provider not found' });
    }

    user.status = 'approved';
    await user.save();

    res.status(200).json({ message: 'Provider approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error approving provider', error });
  }
});
router.put('/admin/reject/:id', authenticateUser, authorizeAdmin, async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);

    if (!user || user.role !== 'provider') {
      return res.status(404).json({ message: 'Provider not found' });
    }

    user.status = 'pending';
    user.role = 'customer'; 
    user.serviceType = undefined;
    user.contact = undefined;
    user.address = undefined;
    await user.save();

    res.status(200).json({ message: 'Provider Reject successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error approving provider', error });
  }
});



module.exports = router;
