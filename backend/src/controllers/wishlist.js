const jwt = require("jsonwebtoken");
const HttpError = require("../helpers/HttpError");
const Wishlist = require("../models/wishlists");
const Book = require("../models/books");

Wishlist.belongsTo(Book, { as: "Book", foreignKey: "id" });

module.exports = {
  getAllWishlist: async (req, res) => {
    try {
      const TOKEN = jwt.decode(req.token);
      if (TOKEN.role !== "member") {
        throw new HttpError(403, "Forbidden", "No Authorized");
      }
      const userId = Number(req.params.user_id);
      if (TOKEN.id !== userId) {
        throw new HttpError(405, "Not Allowed", "No Authorized");
      }

      const wishlist = await Wishlist.findAll({
        include: [
          {
            as: "Book",
            model: Book,
            required: true
          }
        ],
        where: {
          id: req.params.user_id
        }
      });
      if (wishlist.length < 1) {
        res.json({
          message: "Wishlist is Empty"
        });
      } else {
        res.json(wishlist);
      }
    } catch (error) {
      HttpError.handle(res, error);
    }
  },
  addWishlist: async (req, res) => {
    try {
      console.log("SUDAH DISINIIII....");
      const TOKEN = jwt.decode(req.token);
      console.log("TOKEN... ", TOKEN);
      console.log("TOKEN... ", TOKEN);
      if (TOKEN.role !== "member") {
        throw new HttpError(403, "Forbidden", "No Authorized");
      }
      const userId = Number(req.params.user_id);
      if (TOKEN.id !== userId) {
        throw new HttpError(405, "Not Allowed", "No Authorized");
      }

      const getWishlist = await Wishlist.findAll({
        where: {
          id_user: req.params.user_id
        }
      });
      const isWished = getWishlist.some(whish => {
        return whish.id_book === req.body.id_book;
      });
      if (isWished) {
        throw new HttpError(400, "Bad Request", "You Already Wish This Book");
      }

      await Wishlist.create({
        idUser: req.params.user_id,
        idBook: req.body.id_book
      });
      res.json({
        code: 200,
        status: "OK",
        message: "Success Whishlist"
      });
    } catch (error) {
      HttpError.handle(res, error);
    }
  },
  deleteWishlist: async (req, res) => {
    try {
      const TOKEN = jwt.decode(req.token);
      if (TOKEN.role !== "member") {
        throw new HttpError(403, "Forbidden", "No Authorized");
      }

      const userId = Number(req.params.user_id);
      if (TOKEN.id !== userId) {
        throw new HttpError(403, "Not Allowed", "No Authorized");
      }

      await Wishlist.destroy({
        where: {
          id: req.query.wishlist_id
        }
      });

      res.json({
        code: 200,
        status: "OK",
        message: "Success Delete Wishlist"
      });
    } catch (error) {
      HttpError.handle(res, error);
    }
  },
  checkWishlist: async (req, res) => {
    try {
      // console.log("udah disini.............");
      const TOKEN = jwt.decode(req.token);
      if (TOKEN.role !== "member") {
        throw new HttpError(403, "Forbidden", "No Authorized");
      }
      // console.log("TOKEN ID: ", TOKEN.id);
      // console.log("QUERY USER: ", req.query.id_user);
      if (TOKEN.id !== Number(req.query.id_user)) {
        throw new HttpError(403, "Not Allowed", "No Authorized");
      }

      const wishlist = await Wishlist.findOne({
        where: {
          id_user: req.query.id_user,
          id_book: req.query.id_book
        }
      });
      if (!wishlist) return res.json(false);
      res.json(true);
    } catch (error) {
      HttpError.handle(res, error);
    }
  }
};
