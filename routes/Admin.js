const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');

const AdminController = require('../controllers/AdminController')

router.post('/signup', body('email').isEmail().normalizeEmail(),
    body('password').isLength({
        min: 6
    }), AdminController.signup)
router.post('/login', body('email').isEmail().normalizeEmail(),
    body('password').isLength({
        min: 6
    }), AdminController.login)
router.post('/AddBook', body('Title').isLength({
    min: 6
    }),
    body('Auther').isLength({
        min: 6
    }), AdminController.AddBook)
router.post('/editBook',body('Title').isLength({
    min: 6
    }),
    body('Auther').isLength({
        min: 6
    }) ,AdminController.editBook)
router.get('/getAllBooks', AdminController.getAllBooks)

module.exports = router;
