const express = require("express");
const { Booking, User, Spot, SpotImage } = require("../../db/models");
const spot = require("../../db/models/spot");
const user = require("../../db/models/user");

const router = express.Router();

router.delete("/:bookingId", async (req, res) => {
  const userId = req.user.id;

  const booking = await Booking.findByPk(req.params.bookingId);

  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found",
      statusCode: 404,
    });
  }

  if (booking.userId !== userId) {
    return res
      .status(403)
      .json({ message: "can not delete booking you did not create" });
  }

  const startDate = new Date(booking.startDate).valueOf();
  const now = new Date().valueOf();

  if (startDate <= now) {
    return res.status(403).json({
      message: "Bookings that have been started can't be deleted",
      statusCode: 403,
    });
  }

  await booking.destroy();

  return res.status(200).json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});

router.get("/current", async (req, res) => {
  const userId = req.user.id;

  const bookings = await Booking.findAll({
    where: { userId: userId },
    include: { model: Spot },
  });

  return res.status(200).json({ Bookings: bookings });
});

module.exports = router;
