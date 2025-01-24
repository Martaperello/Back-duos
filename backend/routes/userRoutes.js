const express= require('express');
const { signUp, loginUser, protect } = require('../controllers/authControllers');
const router = express.Router();

router.post('/signup', signUp);

router.post('/login', loginUser)

// Route to verify user authentication 
router.get('/auth-check', protect, (req, res) => { res.status(200).json({ status: 'success', }); });

module.exports = router;