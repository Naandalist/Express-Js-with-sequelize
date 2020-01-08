const BookStatus = require("../models/bookStatuses");
const HttpError = require("../helpers/HttpError");

module.exports = {
  getAllStatus: async (req, res) => {
    try {
      const bookStatus = await BookStatus.findAll({
        attributes: ["id", ["status_name", "status"]]
      });
      res.status(200).json({
        code: 200,
        status: "OK",
        message: "Success Fetch Data Status",
        status: bookStatus
      });
    } catch (error) {
      HttpError.handle(res, error);
    }
  }
};
