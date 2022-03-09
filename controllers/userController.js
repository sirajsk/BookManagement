const collection = require("../config/collection");
const db = require("../config/connection");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { ObjectId } = require("mongodb");

module.exports = {
    signup: async (req, res) => {
        const { firstName, lastName, email, password } = req.body
        try {
            let userExist = await db.get().collection(collection.USER_COLLECTION).findOne({ email: email })

            if (userExist) return res.status(400).json({ errors: 'User already exists' })
            hashedPassword = await bcrypt.hash(password, 10)
            let result = await db.get().collection(collection.USER_COLLECTION).insertOne({ firstName, lastName, email, password: hashedPassword })

            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: result.insertedId })
            console.log(user);
            const token = jwt.sign({ email: user.email, id: user._id }, 'secret', { expiresIn: "1h" })

            return res.status(200).json({ Status: "Signup Ok", user, token })



        } catch (error) {
            return res.status(500).json({ err: error.message })

        }
    },
    login: async (req, res) => {
        const { email, password } = req.body
        try {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: email })

            if (!user) return res.status(400).json({ error: "invalid user" })

            let passwordCheck = await bcrypt.compare(password, user.password)

            if (!passwordCheck) return res.status(400).json({ error: "invalid user" })



            let token = jwt.sign({ email: user.email, id: user._id }, 'secret', { expiresIn: "1h" })

            res.status(200).json({ Status: "Login Ok", user, token })
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message })
        }
    },
    BorrowBook: async (req, res) => {
        let { id } = req.params;

        try {
            let Book = await db.get().collection(collection.BOOK_COLLECTION).findOne({ _id: ObjectId(id) })
            console.log(Book)
            if (Book.Availeblity === true) {
                db.get().collection(collection.BOOK_COLLECTION).updateOne({ _id: ObjectId(id) },
                    { $set: { Availeblity: false } })
                res.status(200).json({ Status: "Sucessfully Borrowed" })
            } else {
                res.status(400).json({ Status: "Not Available" })

            }
        } catch (error) {
            res.status(500).json({ error })

        }
    },
    ReturnBook: async (req, res) => {
        let { id } = req.params;
        try {
            db.get().collection(collection.BOOK_COLLECTION).updateOne({ _id: ObjectId(id) },
                { $set: { Availeblity: true } })
            res.status(200).json({ Status: "Sucessfully Returned" })
        } catch (error) {
            res.status(500).json({ error })

        }
    },
    allBooks: async (req, res) => {
        try {
            let Books = await db.get().collection(collection.BOOK_COLLECTION).find().toArray()
            res.status(200).json({ Status: "ALL BOOKS", Books })

        } catch (error) {
            res.status(500).json({ error })

        }
    }
}