const express = require("express");
const router = express.Router();

const AdminController=require('../controllers/AdminController')

router.post('/login',AdminController.login)
router.post('/AddBook',AdminController.AddBook)
router.post('/editBook',AdminController.editBook)
router.get('/getAllBooks',AdminController.getAllBooks)

module.exports = router;
