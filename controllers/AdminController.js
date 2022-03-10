const collection = require("../config/collection");
const db = require("../config/connection");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const { ObjectId } = require("mongodb");
const mongoose = require('mongoose')
const { body, validationResult } = require('express-validator');

module.exports = {
  signup: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    const { firstName, lastName, email, password } = req.body
    try {
      let AdminExist = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: email })

      if (AdminExist) return res.status(400).json({ errors: 'User already exists' })
      hashedPassword = await bcrypt.hash(password, 10)
      let result = await db.get().collection(collection.ADMIN_COLLECTION).insertOne({ firstName, lastName, email, password: hashedPassword })

      let Admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ _id: result.insertedId })
      console.log(Admin);
      const token = jwt.sign({ email: Admin.email, id: Admin._id }, 'secret', { expiresIn: "1h" })

      return res.status(200).json({ Status: "Signup Ok", Admin, token })



    } catch (error) {
      return res.status(500).json({ err: error.message })

    }
  },
  login: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    const { email, password } = req.body
    try {
      let Admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: email })

      if (!Admin) return res.status(400).json({ error: "invalid user" })

      let passwordCheck = await bcrypt.compare(password, Admin.password)

      if (!passwordCheck) return res.status(400).json({ error: "invalid user" })



      let token = jwt.sign({ email: Admin.email, id: Admin._id }, 'secret', { expiresIn: "1h" })

      res.status(200).json({ Status: "Login Ok", Admin, token })
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message })
    }
  },
  AddBook: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    const { Title, Auther, description, category } = req.body;
    try {
      let Book = await db
        .get()
        .collection(collection.BOOK_COLLECTION)
        .insertOne({
          Title,
          Auther,
          description,
          category,
          Availeblity: true,
        });
      res.status(200).json({ Book, msg: "Book Added" });
    } catch (error) {
      res.status(500).json({ err: error.message });
    }
  }, editBook: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    const { Title, Auther, description, category } = req.body;
    let { id } = req.params;
    try {
      db.get()
        .collection(collection.BOOK_COLLECTION)
        .updateOne(
          { _id: ObjectId(id) },
          { $set: { Title, Auther, description, category } }
        );
      res.status(200).json({ msg: "updated" });
    } catch (error) {
      res.status(500).json({ err: error.message });
    }
  },
  getAllBooks: async (req, res) => {
    try {
      let allArticle = await db
        .get()
        .collection(collection.BOOK_COLLECTION)
        .find()
        .toArray();
      res.status(200).json({ allArticle, msg: "All Articles" });
    } catch (error) {
      res.status(500).json({ err: error.message });
    }
  }
}