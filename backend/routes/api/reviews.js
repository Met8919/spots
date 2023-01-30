const express = require("express");
const { Model } = require("sequelize");
const {
  User,
  Review,
  ReviewImage,
  Spot,
  SpotImage,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

//  ********************************************
//  ****GET ALL REVIEWS OF THE CURRENT USER*****
//  ********************************************

router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const reviews = await Review.findAll({
    where: { userId: userId },
    include: [
      {
        model: Spot,
        include: {
          model: SpotImage,
          as: "previewImage",
          attributes: ["url"],
          where: { preview: true },
        },
      },
      { model: ReviewImage, as: "ReviewImage", attributes: ["url", "id"] },
      {
        model: User,
        attributes: {
          exclude: [
            "username",
            "hashedPassword",
            "email",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    ],
  });

  if (!reviews) {
    return res.json(404).json({ message: "user has no reviews" });
  }

  const reviewsArray = [];

  for (let review of reviews) {
    review = review.toJSON();

    if (review.Spot.previewImage) {

      review.Spot.previewImage = review.Spot?.previewImage[0]?.url || null;
      reviewsArray.push(review);

    }



  }

  // res.json(reviews[0].Spot.previewImage[0].url)

  return res.status(200).json({ Reviews: reviewsArray });
});

//  *******************************************
//  ************ EDIT A REVIEW ****************
//  *******************************************

router.put("/:reviewId", requireAuth, async (req, res) => {
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
      message: "Can not edit review you did not create",
    });
  }

  try {
    await reviewToEdit.update({ review, stars });

    const editedReview = await Review.findByPk(req.params.reviewId);

    return res.status(200).json(editedReview);
  } catch (err) {
    const errors = {};

    for (let i = 0; i < err.errors.length; i++) {
      let property = err.errors[i].message.split(" ")[0];

      if (property === "Street") {
        property = "address";
      } else {
        property = property.toLowerCase();
      }

      errors[property] = err.errors[i].message;
    }

    return res.status(400).json({
      statusCode: 400,
      message: "validation error",
      errors: errors,
    });
  }
});

//  ********************************************************
//  ***ADD AN IMAGE TO A REVIEW BASED ON THE REVIEW'S ID****
//  ********************************************************

router.post("/:reviewId/images", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const { url } = req.body;

  const review = await Review.findByPk(req.params.reviewId);

  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found",
      statusCode: 404,
    });
  }

  if (review.userId !== userId) {
    return res
      .status(403)
      .json({ message: "can not add image to review you did not create" });
  }

  const reviewImageTotal = await ReviewImage.count({
    where: { reviewId: req.params.reviewId },
  });

  if (reviewImageTotal >= 10) {
    return res.status(403).json({
      message: "Maximum number of images for this resource was reached",
      statusCode: 403,
    });
  }

  const newReviewImage = await ReviewImage.create({
    url,
    userId,
    reviewId: req.params.reviewId,
  });

  return res
    .status(200)
    .json({ url: newReviewImage.url, id: newReviewImage.id });
});

//  **************************************
//  *********Delete a Review**************
//  **************************************

router.delete("/:reviewId", requireAuth, async (req, res) => {
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
        "Cannot delete review as it was not created by the current user.",
    });
  }

  await review.destroy();

  return res.status(200).json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});

module.exports = router;
