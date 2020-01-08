const { verify } = require("jsonwebtoken");
const HttpError = require("./HttpError");
// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Do Verify Token
const verifyToken = (req, res, next) => {
  try {
    // Get auth header value
    const bearerHeader = req.headers["authorization"];
    // Check if bearer is undefined
    if (typeof bearerHeader !== "undefined") {
      // Split at the space
      const bearer = bearerHeader.split(" ");
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // Next middleware
      next();
    } else {
      throw new HttpError(403, "Forbidden", "Not Authorized");
    }
  } catch (err) {
    HttpError.handle(res, err);
  }
};

const verifyAdmin = (req, res, next) => {
  const token = req.token;
  try {
    verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.sendStatus(403);
  }
};

const verifyMember = (req, res, next) => {
  const token = req.token;
  try {
    verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.sendStatus(405);
  }
};

module.exports = { verifyToken, verifyAdmin, verifyMember };
