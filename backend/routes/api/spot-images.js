const express = require("express");
const router = express.Router();
const { SpotImage, Spot } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
//  ********************************************
//  ***********DELETE A SPOT IMAGE**************
//  ********************************************

router.delete("/:imageId", requireAuth, async (req, res) => {
  const userId = req.user.id;

  // Get spot image and join spots table for authorization check
  const spotImage = await SpotImage.findByPk(req.params.imageId, {
    include: { model: Spot },
  });

  if (!spotImage)
    return res.status(404).json({
      message: "Spot Image couldn't be found",
      statusCode: 404,
    });

  // Check if user making request owns spot
  if (userId !== spotImage.Spot.ownerId) {
    return res.status(403).json({ message: "Must own spot to delete image" });
  }

  await spotImage.destroy();

  return res.status(200).json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});

module.exports = router;
