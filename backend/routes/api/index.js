const router = require("express").Router();
const { restoreUser } = require("../../utils/auth.js");

const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const spotsRouter = require("./spots.js");
const spotImageRouter = require("./spot-images.js");
const reviewsRouter = require("./reviews");
const reviewImagesRouter = require("./reivew-images");
const bookingsRouter = require("./bookings.js");

router.use(restoreUser);

router.use("/session", sessionRouter);

router.use("/users", usersRouter);
router.use("/spots", spotsRouter);
router.use("/spot-images", spotImageRouter);
router.use("/reviews", reviewsRouter);
router.use("/review-images", reviewImagesRouter);
router.use("/bookings", bookingsRouter);

router.post("/test", function (req, res) {
  res.json({ requestBody: req.body });
});

// // GET /api/set-token-cookie
// const { User } = require("../../db/models");
// const { setTokenCookie } = require("../../utils/auth.js");
// router.get("/set-token-cookie", async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: "Demo-lition",
//     },
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });

// router.get("/restore-user", (req, res) => {
//   return res.json(req.user);
// });

// const { requireAuth } = require("../../utils/auth.js");
// router.get("/require-auth", requireAuth, (req, res) => {
//   return res.json(req.user);
// });

module.exports = router;
