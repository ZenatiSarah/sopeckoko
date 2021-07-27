const express = require('express');
const authCtrl = require('../controllers/auth');
const router = express.Router();
const limite = require('../middleware/rateLimit');

router.post('/signup', limite, authCtrl.signup);
router.post('/login', limite, authCtrl.login);

module.exports = router;