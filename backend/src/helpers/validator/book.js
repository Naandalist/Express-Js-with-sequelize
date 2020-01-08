const Validator = require("validator");
const isEmpty = require("./isEmpty");

const validateBookInput = data => {
  const errors = {};

  let { title, description, author, status, genre, pages } = data;

  title = !isEmpty(title) ? title : "";
  description = !isEmpty(description) ? description : "";
  author = !isEmpty(author) ? author : "";
  status = !isEmpty(status) ? status : "";
  genre = !isEmpty(genre) ? genre : "";
  pages = !isEmpty(pages) ? pages : "";

  if (Validator.isEmpty(title)) {
    errors.title = "Title field is required!";
  }
  if (Validator.isEmpty(description)) {
    errors.description = "Description field is required!";
  }
  if (Validator.isEmpty(author)) {
    errors.description = "author field is required!";
  }
  if (Validator.isEmpty(status)) {
    errors.description = "status field is required!";
  }
  if (Validator.isEmpty(genre)) {
    errors.description = "genre field is required!";
  }
  if (Validator.isEmpty(pages)) {
    errors.description = "pages field is required!";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateBookInput;
