const express = require("express");
const router = express.Router();
const {
  Spot,
  User,
  SpotImage,
  sequelize,
  Review,
  ReviewImage,
  Booking,
} = require("../../db/models");

const { Op } = require("sequelize");

//Create a Booking from a Spot based on the Spot's id

router.post("/:spotId/bookings", async (req, res) => {
  const userId = req.user.id;

  const { startDate, endDate } = req.body;

  const startDateNum = new Date(startDate).valueOf();
  const endDateNum = new Date(endDate).valueOf();

  const spot = await Spot.findByPk(req.params.spotId, {
    include: { model: Booking },
  });

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  }

  if (spot.ownerId === userId) {
    return res.status(404).json({
      message:
        "Sorry, you are not able to book a spot that you own. Please select a different spot to book.",
    });
  }

  if (startDateNum >= endDateNum) {
    return res.status(400).json({
      message: "Validation error",
      statusCode: 400,
      errors: {
        endDate: "endDate cannot be on or before startDate",
      },
    });
  }

  const bookings = spot.Bookings;

  // CHECK FOR OVERLAP OF DATES
  for (let booking of bookings) {
    const bookedStartDate = new Date(booking.startDate).valueOf();
    const bookedEndDate = new Date(booking.endDate).valueOf();

    if (startDateNum >= bookedStartDate && startDateNum <= bookedEndDate) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        statusCode: 403,
        errors: {
          startDate: "Start date conflicts with an existing booking",
        },
      });
    } else if (endDateNum <= bookedEndDate && endDateNum >= bookedStartDate) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        statusCode: 403,
        errors: {
          endDate: "End date conflicts with an existing booking",
        },
      });
    }
  }

  const newBooking = await Booking.create({
    startDate,
    endDate,
    spotId: spot.id,
    userId,
  });

  return res.status(200).json(newBooking);
});

//Get all Bookings for a Spot based on the Spot's id

router.get("/:spotId/bookings", async (req, res) => {
  const userId = req.user.id;
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot)
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });

  const options = {};

  if (spot.ownerId === userId) {
    options.include = { model: User };
  }

  const bookings = await Booking.findAll({
    where: {
      spotId: req.params.spotId,
    },
    ...options,
  });

  return res.status(200).json({ Bookings: bookings });
});

// Get all spots
router.get("/", async (req, res) => {
  let where = {};
  let pagination = {};

  let { page, size } = req.query;
  let { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  if (minLat) where.lat = { [Op.gte]: minLat };
  if (maxLat) where.lat = { [Op.lte]: maxLat };
  if (minLng) where.lng = { [Op.gte]: minLng };
  if (maxLng) where.lng = { [Op.lte]: maxLng };
  if (minPrice) where.price = { [Op.gte]: minPrice };
  if (maxPrice) where.price = { [Op.lte]: maxPrice };

  let offset;
  let limit;
  if (page >= 1 && page <= 10) {
    offset = page;
  } else {
    offset = 1;
  }

  if (size >= 1 && size <= 20) {
    limit = size;
  } else {
    limit = 20;
  }

  pagination.limit = limit;
  pagination.offset = offset;

  const allSpots = await Spot.findAll({
    where,
    ...pagination,
  });

  for (let spot of allSpots) {
    const previewImage = await SpotImage.findOne({
      where: { spotId: spot.id, preview: true },
      attributes: ["url"],
    });

    const spotId = spot.dataValues.id;
    const averageRating = await sequelize.query(
      "SELECT AVG(stars) as averageValue FROM Reviews WHERE spotId = :spotId",
      {
        replacements: { spotId: spotId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    let avg = averageRating[0].averageValue.toFixed(2);

    spot.dataValues["previewImage"] =
      previewImage?.url || "No preview available";

    spot.dataValues["averageRating"] = avg || "No ratings";
  }

  // allSpots["page"] = offset;
  // allSpots["size"] = limit;

  return res.status(200).json({ spots: allSpots, page: offset, size: limit });
});

//  ********************************************
//  ************ CREATE A SPOT *****************
//  ********************************************

router.post("/", async (req, res) => {
  let newSpot;

  const spotValues = ({
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  } = req.body);

  try {
    newSpot = await Spot.create({
      ...spotValues,
      ownerId: req.user.dataValues.id,
    });
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

  return res.status(200).json(newSpot);
});
//
//
/// add image to spot based on spot id
//
//
//
router.post("/:spotId/images", async (req, res) => {
  const userId = parseInt(req.user.dataValues.id);

  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot)
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });

  if (spot.ownerId !== userId)
    return res.status(403).json({ message: "must own spot to add image" });

  let newSpotImage = await SpotImage.create({
    ...req.body,
    spotId: req.params.spotId,
  });
  return res.status(200).json({ newSpotImage });
});

//  ********************************************
//  **************DELETE A SPOT*****************
//  ********************************************

router.delete("/:spotId", async (req, res) => {
  const userId = req.user.id;

  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  }

  if (spot.ownerId !== userId) {
    return res.status(403).json({ message: "must own spot to delete" });
  }

  await spot.destroy();

  return res.status(200).json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});

//  ********************************************
//  **GET ALL SPOTS OWNED BY THE CURRENT USER***
//  ********************************************

router.get("/current", async (req, res) => {
  const userId = req.user.id;

  const spots = await Spot.findAll({
    where: {
      ownerId: userId,
    },
    include: {
      model: SpotImage,
      as: "previewImage",
      where: { preview: true },
      limit: 1,
      attributes: ["url"],
    },
  });

  if (!spots) return res.status(404).json({ message: "no spots found" });

  const spotsArray = [];

  for (let spot of spots) {
    spot = spot.toJSON();
    spot.previewImage = spot.previewImage[0]?.url || "no preview available";
    spotsArray.push(spot);

    const count = await Review.count({ where: { spotId: spot.id } });
    const sum = await Review.sum("stars", {
      where: { spotId: spot.id },
    });

    const avgRating = (sum / count).toFixed(2);

    spot.avgRating = isNaN(avgRating) ? null : avgRating;
  }

  return res.status(200).json({ Spots: spotsArray });
});

//Create a Review for a Spot based on the Spot's id

router.post("/:spotId/reviews", async (req, res) => {
  const userId = req.user.id;
  let { review, stars } = req.body;
  stars = Number(stars);
  const spotId = Number(req.params.spotId);

  if (stars < 1 || stars > 5) {
    return res.status(400).json({ message: "stars must be between 1 and 5" });
  }

  const newRreview = await Review.create({ review, stars, userId, spotId });

  return res.status(201).json(newRreview);
});

// GET ALL REVIEWS BY SPOTS ID

router.get("/:spotId/reviews", async (req, res) => {
  const userId = req.user.id;

  const reviews = await Review.findAll({
    where: { spotId: req.params.spotId },
    include: [{ model: ReviewImage }, { model: User }],
  });

  if (!reviews) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  }

  res.status(200).json({ Reviews: reviews });
});

//  ********************************************
//  ***************EDIT A SPOT******************
//  ********************************************

router.put("/:spotId", async (req, res) => {
  const userId = req.user.dataValues.id;

  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot)
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });

  if (spot.ownerId !== userId)
    return res.status(403).json({ message: "Must own spot to edit" });

  const values = ({
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  } = req.body);

  try {
    await spot.update({ ...values });
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

  return res.status(200).json(spot);
});

//  ********************************************
//  *****GET DETAILS OF A SPOT FROM AN ID*******
//  ********************************************
router.get("/:spotId", async (req, res) => {
  const spotId = parseInt(req.params.spotId);

  const spot = await Spot.findByPk(spotId, {
    include: [
      {
        model: User,
        as: "owner",
        attributes: {
          exclude: ["username", "hashedPassword", "createdAt", "updatedAt",'email'],
        },
      },
      { model: SpotImage, attributes: { exclude: ["createdAt", "updatedAt",'spotId'] } },
      { model: Review, attributes: [] },
    ],

    attributes: [
      "id",
      "ownerId",
      "address",
      "city",
      "state",
      "country",
      "lat",
      "lng",
      "name",
      "description",
      "price",
      "createdAt",
      "updatedAt",
    ],
  });

  if (!spot)
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });

  const numReviews = await Review.count({
    where: { spotId: spot.id },
  });

  const sum = await Review.sum("stars", {
    where: { spotId: spot.id },
  });

  spot.dataValues["avgStarRating"] = Math.round((sum / numReviews) * 100) / 100;
  spot.dataValues["numReviews"] = numReviews;

  return res.json(spot);
});

module.exports = router;
