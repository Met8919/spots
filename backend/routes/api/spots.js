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
const { requireAuth } = require("../../utils/auth");

//--------------------------------------------------------
// : CREATE A BOOKING FROM A SPOT BASED ON THE SPOT'S ID
// : GET ALL BOOKINGS FOR A SPOT BASED ON THE SPOT'S ID
// : GET ALL SPOTS
//

//  ************************************************************
//  *****CREATE A BOOKING FROM A SPOT BASED ON THE SPOT'S ID****
//  ************************************************************

router.post("/:spotId/bookings", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const { startDate, endDate } = req.body;

  const startDateNum = new Date(startDate).valueOf();
  const endDateNum = new Date(endDate).valueOf();
  const now = new Date().valueOf();

  const spot = await Spot.findByPk(req.params.spotId, {
    include: { model: Booking },
  });

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  }

  if (startDateNum <= now) {
    console.log("should send");
    return res.status(404).json({
      message: "Booking must be set to future date",
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

//  ************************************************************
//  *****GET ALL BOOKINGS FOR A SPOT BASED ON THE SPOT'S ID*****
//  ************************************************************

router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot)
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });

  const options = {};

  if (spot.ownerId === userId) {
    options.include = {
      model: User,
      attributes: {
        exclude: [
          "username",
          "email",
          "hashedPassword",
          "createdAt",
          "updatedAt",
        ],
      },
    };
  } else {
    options.attributes = {
      exclude: ["createdAt", "updatedAt", "id", "userId"],
    };
  }

  const bookings = await Booking.findAll({
    where: {
      spotId: req.params.spotId,
    },

    ...options,
  });

  return res.status(200).json({ Bookings: bookings });
});

//  ********************************************
//  ************ GET ALL SPOTS *****************
//  ********************************************

router.get("/", async (req, res) => {
  const where = {};
  const pagination = {};
  let offset, limit, avg;

  let values = req.query;

  for (let val in values) {
    values[val] = Number(values[val]);
  }

  const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    values;

  let errors = {};
  if (page < 1) {
    errors.page = "Page must be greater than or equal to 1";
  }
  if (size < 1) {
    errors.size = "Size must be greater than or equal to 1";
  }
  if (maxLat < -90 || maxLat > 90) {
    errors.maxLat = "Maximum latitude is invalid";
  }
  if (minLat < -90 || minLat > 90) {
    errors.minLat = "Minimum latitude is invalid";
  }
  if (maxLng < -180 || maxLng > 180) {
    errors.maxLng = "Maximum longitude is invalid";
  }
  if (minLng < -180 || minLng > 180) {
    errors.minLng = "Minimum longitude is invalid";
  }
  if (maxPrice < 0) {
    errors.maxPrice = "Maximum price must be greater than or equal to 0";
  }
  if (minPrice < 0) {
    errors.minPrice = "Minimum price must be greater than or equal to 0";
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({
      message: "Validation Error",
      statusCode: 400,
      errors,
    });
  }

  // query conditionals
  if (minLat) where.lat = { [Op.gte]: minLat };
  if (maxLat) where.lat = { [Op.lte]: maxLat };
  if (minLng) where.lng = { [Op.gte]: minLng };
  if (maxLng) where.lng = { [Op.lte]: maxLng };
  if (minPrice) where.price = { [Op.gte]: minPrice };
  if (maxPrice) where.price = { [Op.lte]: maxPrice };

  // Within range or set to default
  if (page >= 1 && page <= 10) {
    pagination.offset = page;
    offset = page;
  } else {
    pagination.offset = 1;
    offset = 1;
  }

  if (size >= 1 && size <= 20) {
    pagination.limit = size;
    limit = size;
  } else {
    pagination.limit = 20;
    limit = 20;
  }

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
    // const averageRating = await sequelize.query(
    //   "SELECT AVG(stars) as averageValue FROM Reviews WHERE spotId = :spotId",
    //   {
    //     replacements: { spotId: spotId },
    //     type: sequelize.QueryTypes.SELECT,
    //   }
    // );

    const reviewCount = await Review.count({ where: { spotId: spotId } });
    const sum = await Review.sum("stars", {
      where: { spotId: spotId },
    });

    const averageRating = sum / reviewCount;

    if (averageRating) {
      avg = averageRating.toFixed(2);
    }

    spot.dataValues.previewImage = previewImage?.url || null;

    spot.dataValues.avgRating = avg || null;
  }

  return res.status(200).json({ spots: allSpots, page: offset, size: limit });
});

//  ********************************************
//  ************ CREATE A SPOT *****************
//  ********************************************

router.post("/", requireAuth, async (req, res) => {
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
//  *****************************************************
//  ****ADD AN IMAGE TO A SPOT BASED ON THE SPOT'S ID****
//  *****************************************************
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot)
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });

  if (spot.ownerId !== userId)
    return res.status(403).json({ message: "must own spot to add image" });

  try {
    const { id, url, preview } = await SpotImage.create({
      ...req.body,
      spotId: req.params.spotId,
    });

    return res.status(200).json({ id, url, preview });
  } catch (err) {
    const errors = {};

    for (let i = 0; i < err.errors.length; i++) {
      let property = err.errors[i].message.split(" ")[0];
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

//  ********************************************2222
//  **************DELETE A SPOT*****************2222
//  ********************************************2222

router.delete("/:spotId", requireAuth, async (req, res) => {
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

router.get("/current", requireAuth, async (req, res) => {
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

//  **********************************************************
//  *****CREATE A REVIEW FOR A SPOT BASED ON THE SPOT'S ID****
//  **********************************************************

router.post("/:spotId/reviews", requireAuth, async (req, res) => {
  const userId = req.user.id;
  let { review, stars } = req.body;
  stars = Number(stars);
  const spotId = Number(req.params.spotId);

  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  }

  const postedReview = await Review.findOne({
    where: {
      spotId: req.params.spotId,
      userId: userId,
    },
  });

  if (postedReview) {
    return res.status(403).json({
      message: "User already has a review for this spot",
      statusCode: 403,
    });
  }

  try {
    const newRreview = await Review.create({ review, stars, userId, spotId });

    return res.status(201).json(newRreview);
  } catch (err) {
    const errors = {};

    for (let i = 0; i < err.errors.length; i++) {
      let property = err.errors[i].message.split(" ")[0];
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

//  ********************************************
//  *******GET ALL REVIEWS BY SPOTS ID**********
//  ********************************************

router.get("/:spotId/reviews", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const reviews = await Review.findAll({
    where: { spotId: req.params.spotId },
    include: [
      { model: ReviewImage, attributes: ["id", "url"] },
      { model: User, attributes: ["id", "firstname", "lastname"] },
    ],
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

router.put("/:spotId", requireAuth, async (req, res) => {
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
    return res.status(200).json(spot);
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
          exclude: [
            "username",
            "hashedPassword",
            "createdAt",
            "updatedAt",
            "email",
          ],
        },
      },
      {
        model: SpotImage,
        attributes: { exclude: ["createdAt", "updatedAt", "spotId"] },
      },
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
