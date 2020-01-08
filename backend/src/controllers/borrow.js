const jwt = require("jsonwebtoken");
const moment = require("moment");
const HttpError = require("../helpers/HttpError");
const BookStatus = require("../models/bookStatuses");
const Borrow = require("../models/borrows");
const Book = require("../models/books");

Borrow.belongsTo(Book, { as: "Book", foreignKey: "book_id" });

module.exports = {
  getBorrow: async (req, res) => {
    try {
      const TOKEN = jwt.decode(req.token);
      if (TOKEN.role !== "member") {
        throw new HttpError(403, "Forbidden", "No Authorized");
      }
      const userId = Number(req.params.user_id);
      if (TOKEN.id !== userId) {
        throw new HttpError(405, "Not Allowed", "No Authorized");
      }

      const borrow = await Borrow.findAll({
        include: [
          {
            as: "Book",
            model: Book,
            required: true
          }
        ],
        attributes: {
          exclude: ["created_at", "updated_at"]
        },
        where: {
          user_id: req.params.user_id,
          is_return: false
        }
      });

      if (borrow.length < 1) {
        throw new HttpError(404, "Not Found", "Your Borrow List is Empty");
      }

      res.status(200).json({
        code: 200,
        status: "OK",
        message: "Success Fetching Data Borrow",
        borrow
      });
    } catch (error) {
      HttpError.handle(res, error);
    }
  },
  getBorrowHistory: async (req, res) => {
    try {
      const TOKEN = jwt.decode(req.token);
      if (token.role !== "member") {
        throw new HttpError(403, "Forbidden", "No Authorized");
      }

      if (TOKEN.id !== req.params.user_id) {
        throw new HttpError(405, "Not Allowed", "No Authorized");
      }

      const borrow = await Borrow.findAll({
        include: [
          {
            as: "Book",
            model: Book,
            required: true
          }
        ],
        where: {
          user_id: req.params.user_id,
          is_return: true
        }
      });

      if (borrow.length < 1) {
        throw new HttpError(404, "Not Found", "Your Borrow List is Empty");
      }

      res.status(200).json({
        code: 200,
        status: "OK",
        message: "Success Fetching Data Borrow",
        borrow
      });
    } catch (error) {
      HttpError.handle(res, error);
    }
  },
  addBorrow: async (req, res) => {
    try {
      const TOKEN = jwt.decode(req.token);
      if (TOKEN.role !== "member") {
        throw new HttpError(403, "Forbidden", "No Authorized");
      }

      if (TOKEN.id !== Number(req.params.user_id)) {
        throw new HttpError(405, "Not Allowed", "No Authorized");
      }

      const book = await Book.findOne({
        where: {
          id: req.body.book_id
        }
      });
      if (!book) {
        throw new HttpError(404, "NotFound", "Book Not Found");
      }

      const borrow = await Borrow.findAll({
        where: {
          userId: req.params.user_id,
          isReturn: false
        }
      });

      const isBorrowed = borrow.some(item => {
        return item.book_id === req.body.novel_id;
      });
      if (isBorrowed)
        throw new HttpError(400, "Bad Request", "You Already Borrow This Book");

      let date = moment().format("YYYY-MM-DD");
      let formAtted = moment(date).format("YYYY MMM DD");
      //   console.log(formAtted);
      console.log("BOOK ID: ", req.body.book_id);
      const borrowData = {
        userId: req.params.user_id,
        bookId: req.body.book_id,
        createdAt: date,
        isReturn: false
      };
      Borrow.create(borrowData);
      // console.log(borrowData);
      // console.log(date);

      res.json({
        code: 200,
        status: "OK",
        message: "Success Borrow",
        borrow: borrowData
      });
    } catch (error) {
      HttpError.handle(res, error);
    }
  },
  updateBorrow: async (req, res) => {
    try {
      const TOKEN = jwt.decode(req.token);
      if (TOKEN.role !== "member") {
        throw new HttpError(403, "Forbidden", "No Authorized");
      }
      const userId = Number(req.params.user_id);
      if (TOKEN.id !== userId) {
        throw new HttpError(405, "Not Allowed", "No Authorized");
      }

      let date = moment().format("YYYY-MM-DD");
      await Borrow.update(
        { isReturn: 1, updatedAt: date },
        {
          where: {
            id: req.body.borrow_id,
            user_id: req.params.user_id,
            book_id: req.body.book_id
          }
        }
      );
      res.json({
        code: 200,
        status: "OK",
        message: "Success Update Borrow"
      });
    } catch (error) {
      HttpError.handle(res, error);
    }
  },
  checkBorrow: async (req, res) => {
    try {
      const TOKEN = jwt.decode(req.token);
      if (TOKEN.role !== "member") {
        throw new HttpError(403, "Forbidden", "No Authorized");
      }
      const idUser = Number(req.query.id_user);
      if (TOKEN.id !== idUser) {
        throw new HttpError(405, "Not Allowed", "No Authorized");
      }

      const borrow = await Borrow.findOne({
        where: {
          user_id: req.query.id_user,
          book_id: req.query.id_book,
          is_return: false
        }
      });
      if (!borrow) {
        res.json(false);
      }
      res.json(true);
    } catch (error) {
      HttpError.handle(res, error);
    }
  }
};
