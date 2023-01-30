const express = require("express");

const router = express.Router();

const { ReviewImage, Review } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

router.get("/", async (req, res) => {
  return res.json({ message: "test" });
});

//  ********************************************
//  **********Delete a Review Image*************
//  ********************************************

router.delete("/:imageId", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const image = await ReviewImage.findByPk(req.params.imageId, {
    include: { model: Review },
  });

  if (!image) {
    return res.status(404).json({
      message: "Review Image couldn't be found",
      statusCode: 404,
    });
  }

  if (image.Review.userId !== userId) {
    return res
      .status(403)
      .json({ message: "must have created image to delete" });
  }

  await image.destroy();

  res.status(200).json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});

module.exports = router;
