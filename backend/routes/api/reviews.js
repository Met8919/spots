const express = require("express");
const { Model } = require("sequelize");
const { User, Review, ReviewImage, Spot } = require("../../db/models");

const router = express.Router();

router.get("/current", async (req, res) => {
  const userId = req.user.id;

  const reviews = await Review.findAll({
    where: { userid: userId },
    include: [{ model: Spot }, { model: ReviewImage }, { model: User }],
  });

  return res.status(200).json({ Reviews: reviews });
});

//EDIT A REVIEW

router.put("/:reviewId", async (req, res) => {
  const userId = req.user.id;

  const reviewToEdit = await Review.findByPk(req.params.reviewId);

  const { review, stars } = req.body;

  if (!reviewToEdit) {
    return res.status(404).json({
      message: "Review couldn't be found",
      statusCode: 404,
    });
  }

  if (reviewToEdit.userId !== userId) {
    res.status(403).json({
      message:
        "Error: Cannot edit review as it was not created by the current user.",
    });
  }

  await reviewToEdit.update({ review, stars });
  const editedReview = await Review.findByPk(req.params.reviewId);

  return res.status(200).json(editedReview);
});

// Add an Image to a Review based on the Review's id

router.post("/:reviewId/images", async (req, res) => {
  const userId = req.user.id;

  const { url } = req.body;

  const review = await Review.findByPk(req.params.reviewId);

  if (review.userId !== userId) {
    return res
      .status(403)
      .json({ message: "can not add image to review you did not create" });
  }

  const newReviewImage = await Review.create({ url, userId });

  return res.status(200).json(newReviewImage);
});

/// DELETE REVIEW BY ID

router.delete("/:reviewId", async (req, res) => {
  const userId = req.user.id;

  const review = await Review.findByPk(req.params.reviewId);

  if (!review)
    return res.status(404).json({
      message: "Review couldn't be found",
      statusCode: 404,
    });

  if (review.userId !== userId) {
    return res.status(403).json({
      message:
        "Error: Cannot delete review as it was not created by the current user.",
    });
  }

  await review.destroy();

  return res.status(200).json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});

module.exports = router;
