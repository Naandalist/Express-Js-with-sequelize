const User = require("../models/users");
const HttpError = require("../helpers/HttpError");
const { sign } = require("jsonwebtoken");
const { hashSync, genSaltSync, compareSync } = require("bcryptjs");

const {
  validateInputLogin,
  validateInputRegister
} = require("../helpers/validator/user");

module.exports = {
  getAllUser: async (req, res) => {
    try {
      const user = await User.findAll({
        // id	name	email	password	avatar	role	created_at	updated_at
        attributes: ["id", "name", "email", "password", "avatar", "role"]
      });
      res.status(200).json({
        code: 200,
        status: "OK",
        message: "Success Fetch Data User",
        userResult: user
      });
    } catch (error) {
      HttpError.handle(res, error);
    }
  },
  registerUser: async (req, res) => {
    try {
      console.log("BODY...", req.body);
      const { errors, isValid } = validateInputRegister(req.body);

      if (!isValid) {
        throw new HttpError(400, "Bad Request", errors);
      }

      const user = await User.findOne({
        where: {
          email: req.body.email
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"]
        }
      });
      if (user) {
        if (user.email === req.body.email) {
          throw new HttpError(400, "Bad Request", {
            email: `User with email ${req.body.email} has already exist!`
          });
        }
      }

      const salt = genSaltSync(10);
      const password = hashSync(req.body.password, salt);
      const data = {
        ...req.body,
        password
      };
      await User.create(data);
      delete data.password;

      res.json({
        code: 200,
        status: "OK",
        message: "Succes Register User",
        data
      });
    } catch (error) {
      HttpError.handle(res, error);
    }
  },
  loginMember: async (req, res) => {
    try {
      console.log("REQ BODY...", req.body);
      const { errors, isValid } = validateInputLogin(req.body);
      if (!isValid) {
        throw new HttpError(400, "Bad Request", errors);
      }

      const user = await User.findOne({
        where: {
          email: req.body.email,
          role: "member"
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"]
        }
      });
      if (!user) {
        throw new HttpError(400, "Bad Reqxuest", {
          email: `Cannot find user with email ${req.body.email}`
        });
      }

      const parsedUser = JSON.parse(JSON.stringify(user));
      if (compareSync(req.body.password, parsedUser.password)) {
        delete parsedUser.password;
        const token = sign(parsedUser, process.env.JWT_SECRET);
        // res.json(token);
        res.json({
          code: 200,
          status: "OK",
          message: "Success Login as Member",
          token: token
        });
      } else {
        throw new HttpError(400, "Bad Request", {
          password: `Wrong Password`
        });
      }
    } catch (error) {
      HttpError.handle(res, error);
    }
  },
  loginAdmin: async (req, res) => {
    try {
      const { errors, isValid } = validateInputLogin(req.body);
      if (!isValid) {
        throw new HttpError(400, "Bad Request", errors);
      }

      const user = await User.findOne({
        where: {
          email: req.body.email,
          role: "admin"
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"]
        }
      });

      if (!user) {
        throw new HttpError(400, "Bad Reqxuest", {
          email: `Cannot find user with email ${req.body.email}`
        });
      }

      const parsedUser = JSON.parse(JSON.stringify(user));

      if (compareSync(req.body.password, parsedUser.password)) {
        delete parsedUser.password;
        const token = sign(parsedUser, process.env.JWT_SECRET, {
          expiresIn: "7days"
        });
        // res.json(token);
        res.json({
          code: 200,
          status: "OK",
          message: "Success Login as Admin",
          token: token
        });
      } else {
        throw new HttpError(400, "Bad Request", {
          password: `Wrong Password`
        });
      }
    } catch (error) {
      HttpError.handle(res, error);
    }
  }
};
