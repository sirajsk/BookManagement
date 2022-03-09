const collection = require("../config/collection");
const db = require("../config/connection");
const jwt = require('jsonwebtoken');
const { ObjectId } = require("mongodb");

module.exports={
    login:async(req,res)=>{
        const { email, passwrod } = req.body

        try {
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: email })
            console.log('2');

            if (!admin) return res.status(400).json({ error: "invalid " })
            if (passwrod === admin.passwrod) {

                let token = jwt.sign({ email: admin.email, id: admin._id }, 'secret', { expiresIn: "1h" })

                res.status(200).json({status:"LOGIN OK", admin, token })
            } else {

                return res.status(400).json({ error: "invalid Admin" })
            }  
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    },
    AddBook:async (req,res)=>{
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