const express = require("express");
const router = express.Router();
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { Op } = require("sequelize");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const user = require("../../db/models/user");

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

router.post("/", async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;

  const errors = {};

  const eMail = await User.findOne({ where: { email: email } });
  const userName = await User.findOne({ where: { username: username } });

  if (eMail) {
    errors.email = "User with that email already exists";
  }

  if (userName) {
    errors.userName = "User with that username already exists";
  }

  if (Object.values(errors).length) {
    return res.status(403).json({
      message: "Validation error",
      statusCode: 403,
      errors: errors,
    });
  }

  try {
    const user = await User.signup({
      email,
      username,
      password,
      firstName,
      lastName,
    });

    await setTokenCookie(res, user);
    return res.json({
      user: user,
    });
  } catch (err) {
    const errors = {};
    for (let i = 0; i < err.errors.length; i++) {
      let property = err.errors[i].message.split(" ")[0];

      if (property === "First") {
        property = "firstName";
      }
      if (property === "Please") {
        property = "username";
      }

      property = property.toLowerCase();
      errors[property] = err.errors[i].message;
    }

    return res.status(400).json({
      statusCode: 400,
      message: "validation error",
      errors: errors,
    });
  }
});

module.exports = router;
