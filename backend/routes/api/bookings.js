const express = require("express");
const { Booking, User, Spot, SpotImage } = require("../../db/models");
const spot = require("../../db/models/spot");
const user = require("../../db/models/user");

const router = express.Router();

//  ********************************************
//  ************ DELETE BOOKING ****************
//  ********************************************

router.delete("/:bookingId", async (req, res) => {
  const userId = req.user.id;

  const bookingToDelete = await Booking.findByPk(req.params.bookingId);

  if (!bookingToDelete) {
    return res.status(404).json({
      message: "Booking couldn't be found",
      statusCode: 404,
    });
  }

  if (bookingToDelete.userId !== userId) {
    return res
      .status(403)
      .json({ message: "can not delete booking you did not create" });
  }

  const startDate = new Date(bookingToDelete.startDate).valueOf();
  const now = new Date().valueOf();

  if (startDate <= now) {
    return res.status(403).json({
      message: "Bookings that have been started can't be deleted",
      statusCode: 403,
    });
  }

  await bookingToDelete.destroy();

  return res.status(200).json({
    message: "Successfully deleted",
    statusCode: 200,
  });
});

//  ********************************************
//  **** GET ALL BOOKINGS OF CURRENT USER ******
//  ********************************************

router.get("/current", async (req, res) => {
  const userId = req.user.id;

  const bookings = await Booking.findAll({
    where: { userId: userId },

    include: {
      model: Spot,

      include: {
        model: SpotImage,
        as: "previewImage",
        limit: 1,
        where: { preview: true },
        attributes: ["url"],
      },
    },
  });

  if (!bookings) {
    return res.status(404).json({ message: "no bookings" });
  }

  const bookingsArray = [];
  for (let booking of bookings) {
    booking = booking.toJSON();

    booking.Spot.previewImage = booking.Spot.previewImage[0].url;

    bookingsArray.push(booking);
  }

  return res.status(200).json({ Bookings: bookingsArray });
});

//  ********************************************
//  ************ EDIT BOOKING ******************
//  ********************************************

router.put("/:bookingId", async (req, res) => {
  const userId = req.user.id;
  const { startDate, endDate } = req.body;

  const bookingToEdit = await Booking.findByPk(req.params.bookingId);

  // CHECK IF BOOKING EXISTS
  if (!bookingToEdit) {
    return res.status(404).json({
      message: "Booking couldn't be found",
      statusCode: 404,
    });
  }

  // CHECK IF BOOKING BELONGS TO CURRENT USER
  if (bookingToEdit.userId !== userId) {
    return res.status(200).json({
      message:
        "Error: You are not authorized to edit this booking. This booking does not belong to you.",
    });
  }

  const currentStartDateNum = new Date(bookingToEdit.startDate).valueOf();

  // CHECK IF BOOKING HAS ALREADY OCCURED
  const now = new Date().valueOf();
  if (currentStartDateNum <= now) {
    return res.status(403).json({
      message: "Past bookings can't be modified",
      statusCode: 403,
    });
  }
  // VALIDATE EDITED DATES
  if (startDate >= endDate) {
    return res.status(400).json({
      message: "Validation error",
      statusCode: 400,
      errors: {
        endDate: "endDate cannot come before startDate",
      },
    });
  }

  // GET ALL BOOKINGS AT THE SAME SPOT FOR DATE COMPARISON
  const bookings = await Booking.findAll({
    where: {
      spotId: bookingToEdit.spotId,
    },
  });

  const startDateNum = new Date(startDate).valueOf();
  const endDateNum = new Date(endDate).valueOf();


  //CHECK IF EDITED DATE OVERLAPS WITH OTHER BOOKINGS
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

  // UPDATE BOOKING
  const editedBooking = await bookingToEdit.update({ startDate, endDate });

  return res.status(200).json(editedBooking);
});

module.exports = router;
