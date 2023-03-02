const express = require("express");
const router = express.Router();
const apiRouter = require("./api");

router.use("/api", apiRouter);

// Static routes

// Serve React build files in production
router.use((req, res, next) => {
  console.log(
    "request hits before if process node env",
    "this is node_env",
    process.env.NODE_ENV
  );
  next();
});

console.log(
  "on file load before if process",
  "this is process.env",
  process.env
);
if (process.env.NODE_ENV === "production") {
  console.log(
    "on file load after if process",
    "this is process.env",
    process.env
  );

  router.use((req, res, next) => {
    console.log("request hits inside process", process.env.NODE_ENV);
    next();
  });

  const path = require("path");
  // Serve the frontend's index.html file at the root route
  router.get("/", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    res.sendFile(
      path.resolve(__dirname, "../../frontend", "build", "index.html")
    );
  });

  // Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve("../frontend/build")));

  // Serve the frontend's index.html file at all other routes NOT starting with /api
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    res.sendFile(
      path.resolve(__dirname, "../../frontend", "build", "index.html")
    );
  });
}

// Add a XSRF-TOKEN cookie in development
if (process.env.NODE_ENV !== "production") {
  router.get("/api/csrf/restore", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    res.status(201).json({});
  });
}

module.exports = router;
