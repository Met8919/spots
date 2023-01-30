const express = require("express");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");
const router = express.Router();
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

// const validateLogin = [
//   check("credential")
//     .exists({ checkFalsy: true })
//     .notEmpty()
//     .withMessage("Please provide a valid email or username."),
//   check("password")
//     .exists({ checkFalsy: true })
//     .withMessage("Please provide a password."),
//   handleValidationErrors,
// ];
//validateLogin in here for middleware
router.post("/", async (req, res, next) => {
  const { credential, password } = req.body;

  

  const errors = {};

  if (!credential) {
    errors.credential = "Email or username is required";
  }
  if (!password) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({
      message: "Validation error",
      statusCode: 400,
      errors,
    });
  }

  const user = await User.login({ credential, password });

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
      statusCode: 401,
    });
  }

  await setTokenCookie(res, user);

  return res.json({
    user: user,
  });
});

router.delete("/", (_req, res) => {
  res.clearCookie("token");
  return res.json({ message: "success" });
});

router.get("/", restoreUser, (req, res) => {
  const { user } = req;
  if (user) {
    return res.json({
      // user: user.toSafeObject(),
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      },
    });
  } else return res.json({ user: null });
});

module.exports = router;
