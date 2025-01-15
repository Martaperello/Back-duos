const express= require('express');
const { signUp, loginUser } = require('../controllers/authControllers');
const router = express.Router();

router.post('/signup', signUp);

router.post('/login', loginUser)

module.exports = router;