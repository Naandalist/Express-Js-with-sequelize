const Validator = require("validator");
const isEmpty = require("./isEmpty");

const validateInputLogin = data => {
  let errors = {};

  let { email, password } = data;
  email = !isEmpty(email) ? email : "";
  password = !isEmpty(password) ? password : "";

  console.log("email>>>", email);
  console.log("PASS>>>", password);
  if (!Validator.isEmail(email)) {
    errors.email = "Email is invalid";
  }
  if (Validator.isEmpty(email)) {
    errors.email = "Email field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

const validateInputRegister = data => {
  let errors = {};
  console.log("DATA...", data);
  let { email, name, password } = data;
  email = !isEmpty(email) ? email : "";
  name = !isEmpty(name) ? name : "";
  password = !isEmpty(password) ? password : "";

  if (!Validator.isEmail(email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(email)) {
    errors.email = "Email field is required";
  }
  if (Validator.isEmpty(name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(password)) {
    errors.password = "Password field is required";
  }

  if (!Validator.isLength(password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = {
  validateInputLogin,
  validateInputRegister
};
