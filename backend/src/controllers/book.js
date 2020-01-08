const Sequelize = require("sequelize");
const fs = require("fs");
const Op = Sequelize.Op;
const { format } = require("date-fns");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const HttpError = require("../helpers/HttpError");
const validateBookInput = require("../helpers/validator/book");
const cloudinary = require("../config/cloudinary");

const Book = require("../models/books");
const BookStatus = require("../models/bookStatuses");
const Genre = require("../models/genres");

Book.belongsTo(BookStatus, { as: "Status", foreignKey: "status" });
Book.belongsTo(Genre, { as: "Genre", foreignKey: "genre" });

module.exports = {
  //GET BOOK
  getBook: async (req, res) => {
    try {
      const condition = {};
      let { title, author, status, genre, limit, page = 1 } = req.query;

      if (title) {
        condition.where = {
          title: {
            [Op.like]: `%${title}%`
          }
        };
      }
      if (author) {
        condition.where = {
          author: {
            [Op.like]: `%${author}%`
          }
        };
      }
      if (status) {
        condition.where = { ...condition, status };
      }
      if (genre) {
        condition.where = { ...condition, genre };
      }
      if (limit) {
        limit = Number.parseInt(limit < 1 ? 1 : limit);
        page = Number.parseInt(page < 1 ? 1 : page);

        condition.limit = limit;
        condition.offset = (page - 1) * limit;
      }

      const result = await Book.findAndCountAll({
        include: [
          {
            as: "Status",
            model: BookStatus,
            attributes: ["status_name"],
            required: true
          },
          {
            as: "Genre",
            model: Genre,
            attributes: ["genre_name"],
            required: true
          }
        ],
        attributes: {
          exclude: ["status", "genre", "updatedAt"]
        },
        ...condition
      });

      if (result.rows.length < 1) {
        throw new HttpError(404, "Not Found", "Cannot find any Book");
      }

      const parsedResult = JSON.parse(JSON.stringify(result.rows));

      const finalResult = parsedResult.map((finalRes, index) => {
        return {
          ...finalRes,
          Status: finalRes.Status.status_name,
          Genre: finalRes.Genre.genre_name,
          createdAt: moment(finalRes.createdAt).format("YYYY MMM DD")
        };
      });

      res.status(200).json({
        code: 200,
        status: "OK",
        message: "Success Fetching Data Book",
        totalData: result.count,
        result: finalResult
      });
    } catch (error) {
      HttpError.handle(res, error);
    }
  },
  //GET SELECTED BOOK
  getSelectedBook: async (req, res) => {
    try {
      const U = jwt.decode(req.token);
      if (U.role !== "member" && U.Role !== "admin") {
        throw new HttpError("403", "Forbidden", "No Authorized");
      } else {
        const data = await Book.findByPk(req.params.id, {
          include: [
            {
              as: "Status",
              model: BookStatus,
              attributes: ["status_name"],
              required: true
            },
            {
              as: "Genre",
              model: Genre,
              attributes: ["genre_name"],
              required: true
            }
          ],
          attributes: {
            exclude: ["status", "genre", "updatedAt"]
          }
        });
        if (!data) {
          throw new HttpError(
            404,
            "Not Found",
            `Can\'t find book with id: ${req.params.id}`
          );
        }
        const parsedResult = JSON.parse(JSON.stringify(data));
        const date = format(
          new Date(`${parsedResult.createdAt}`),
          "dd MMM yyyy"
        );
        const finalResult = {
          ...parsedResult,
          createdAt: date,
          status: parsedResult.Status.status_name,
          genre: parsedResult.Genre.genre_name
        };
        res.status(200).json(finalResult);
      }
    } catch (error) {
      HttpError.handle(res, error);
    }
  },
  //INSERT DATA
  addBook: async (req, res) => {
    try {
      const U = jwt.decode(req.token);
      if (U.role !== "admin") {
        throw new HttpError(403, "Forbidden", "No Admin, No Authorized");
      }
      const { title, description, author, status, genre, pages } = req.body;

      const { image } = req.files || {};
      if (!image) {
        throw new HttpError(400, "Bad request", "No file selected");
      }

      const body = { title, description, author, status, genre, pages };

      const { errors, isValid } = validateBookInput(body);

      const isBookExist = await Book.findOne({
        where: {
          title: title
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"]
        }
      });
      if (isBookExist) {
        if (isBookExist.title === title) {
          throw new HttpError(400, "Bad Request", {
            report: `Book with title ${title} has already exist!`
          });
        }
      }

      // console.log("IMAGE...", image);
      const filetypes = /jpeg|jpg|png|gif/;
      const mimetype = filetypes.test(image.mimetype);
      if (!mimetype) {
        try {
          fs.unlinkSync(image.tempFilePath);
          throw new HttpError(400, "Bad Request", "File Must be an Image");
        } catch (err) {
          console.log(err);
        }
      }
      if (!isValid) {
        fs.unlink(image.tempFilePath, err => {
          if (err) {
            console.log("Cannot Delete File");
          }
        });
        throw new HttpError(400, "Bad Request", errors);
      }
      const cloudinar = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "bookslib-storage"
      });
      try {
        fs.unlinkSync(image.tempFilePath);
      } catch (err) {
        console.log(err);
      }
      const date = format(new Date(), "yyyy-mm-dd");
      Book.create({
        ...body,
        image: cloudinar.url,
        created_at: date,
        updated_at: date
      });
      res.status(200).json({
        code: 200,
        status: "OK",
        message: "Succes Insert Book",
        data: {
          ...body,
          image: cloudinar.url,
          created_at: date,
          updated_at: date
        }
      });
    } catch (error) {
      HttpError.handle(res, error);
    }
  },
  editBook: async (req, res) => {
    try {
      const U = jwt.decode(req.token);
      if (U.role !== "admin") {
        throw new HttpError(403, "Forbidden", "No Admin, No Authorized");
      }

      const book = await Book.findByPk(req.params.id);
      if (!book) {
        throw new HttpError(
          404,
          "Not Found",
          `Can\'t find book with id: ${req.params.id}`
        );
      }
      const { image } = req.files || {};
      if (image) {
        const im = book.image.split("/");
        if (!image) {
          throw new HttpError(400, "Bad Request", "No File Selected");
        }
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(image.mimetype);
        if (!mimetype) {
          try {
            fs.unlinkSync(image.tempFilePath);
            throw new HttpError(400, "Bad Request", "File is not an image");
          } catch (err) {
            console.log(err);
          }
        }

        const cloudinar = await cloudinary.uploader.upload(image.tempFilePath, {
          folder: "bookslib-storage"
        });

        cloudinary.uploader.destroy(
          "bookslib-storage" + im[im.length - 1].split(".")[0]
        );

        await Book.update(
          {
            image: cloudinar.url
          },
          {
            where: { id: req.params.id }
          }
        );
        try {
          console.log("IMAGE...", image);
          fs.unlinkSync(image.tempFilePath);
          console.log("IMAGE HAS BEEN DELETED...");
          // throw new HttpError(400, "Bad Request", "File is not an image");
        } catch (err) {
          console.log(err);
        }
        res.json({
          code: 200,
          status: "OK",
          message: "Success Update update Image"
        });
      } else {
        await Book.update(
          {
            ...req.body
          },
          {
            where: { id: req.params.id }
          }
        );
        res.json({
          code: 200,
          status: "OK",
          message: "Success Update Book"
        });
      }
    } catch (error) {
      HttpError.handle(res, error);
    }
  },
  //DELETE BOOK
  deleteBook: async (req, res) => {
    try {
      const U = jwt.decode(req.token);
      if (U.role !== "admin") {
        throw new HttpError(403, "Forbidden", "No Admin, No Authorized");
      }

      const book = await Book.findByPk(req.params.id);
      if (!book) {
        throw new HttpError(
          404,
          "Not Found",
          `Can't find book with id ${req.params.id}`
        );
      }

      await Book.destroy({
        where: {
          id: req.params.id
        }
      });

      const im = book.image.split("/");

      cloudinary.uploader.destroy(
        "bookslib-storage" + im[im.length - 1].split(".")[0]
      );

      res.json({
        code: 200,
        status: "OK",
        message: "Success delete book"
      });
    } catch (error) {
      HttpError.handle(res, error);
    }
  }
};
