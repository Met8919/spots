const express = require("express");
const router = express.Router();
const { Spot, User, SpotImage, sequelize, Review } = require("../../db/models");

const { Op } = require("sequelize");

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

  pagination["limit"] = limit;
  pagination["offset"] = offset;

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

// create spot
router.post("/", async (req, res) => {
  if (!req.user) return res.status(403).json({ error: "must be logged in" });
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
    return res.status(400).json({
      message: "validation error",
      error: err.errors.map((err) => err.message.split(".")[1]),
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

  if (!userId)
    return res.status(403).json({ message: "You must be logged in" });

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
//
//
//
// DELETE A SPOT SPOT

router.delete("/:spotId", async (req, res) => {
  const userId = req.user.dataValues.id;

  if (!userId) return res.status(403).json({ message: "must be logged in" });

  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(400).json({
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

router.get("/current", async (req, res) => {
  const userId = req.user.dataValues.id;

  if (!userId) return res.status(403).json({ message: "must be logged in" });

  const spots = await Spot.findAll({
    where: {
      ownerId: userId,
    },
  });

  for (let spot of spots) {
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

  if (!spots) return res.status(404).json({ message: "no spots found" });

  return res.status(200).json(spots);
});

// EDIT A SPOT
//

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
    return res.status(400).json(err);
  }

  return res.status(200).json(spot);
});

//
// GET DETAILS OF A SPOT
//
//
//
//
router.get("/:spotId", async (req, res) => {
  if (!req.user) return res.status(403).json({ message: "must be logged in" });

  const spotId = parseInt(req.params.spotId);

  const spot = await Spot.findByPk(spotId, {
    include: [
      { model: User, as: "owner" },
      { model: SpotImage },
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

  if (!spot.id)
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
