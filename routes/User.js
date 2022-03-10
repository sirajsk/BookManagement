const express = require("express");
const router = express.Router();

const userController=require('../controllers/userController')

router.post('/login',userController.login)
router.post('/signup',userController.signup)
router.post('/BorrowBook/:id',userController.BorrowBook)
router.post('/ReturnBook/:id',userController.ReturnBook)
router.get('/allBooks',userController.allBooks)
module.exports = router;