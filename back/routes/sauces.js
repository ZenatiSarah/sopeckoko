const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const multerImg = require('../middleware/multer-config');
const authProtection = require('../middleware/auth');

router.get('/', authProtection, saucesCtrl.getAllSauces);
router.get('/:id', authProtection, saucesCtrl.getOneSauce);
router.post('/', authProtection, multerImg, saucesCtrl.createSauce);
router.put('/:id', authProtection, multerImg, saucesCtrl.modifySauce);
router.delete('/:id', authProtection, saucesCtrl.deleteSauce);
router.post('/:id/like', authProtection, saucesCtrl.createSauceLike);

module.exports = router;