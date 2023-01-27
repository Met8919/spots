"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Bookings";
    return queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 3,
          userId: 4,
          startDate: "2021-11-19",
          endDate: "2021-11-20",
        },
        {
          spotId: 2,
          userId: 5,
          startDate: "2021-11-22",
          endDate: "2021-11-23",
        },
        {
          spotId: 1,
          userId: 2,
          startDate: "2021-11-24",
          endDate: "2021-11-26",
        },
        {
          spotId: 6,
          userId: 1,
          startDate: "2021-11-27",
          endDate: "2021-11-28",
        },
        {
          spotId: 5,
          userId: 6,
          startDate: "2021-11-30",
          endDate: "2021-12-01",
        },
        {
          spotId: 4,
          userId: 3,
          startDate: "2021-12-02",
          endDate: "2021-12-03",
        },
        {
          spotId: 3,
          userId: 2,
          startDate: "2021-12-04",
          endDate: "2021-12-05",
        },
        {
          spotId: 2,
          userId: 1,
          startDate: "2021-12-06",
          endDate: "2021-12-07",
        },
        {
          spotId: 1,
          userId: 6,
          startDate: "2021-12-08",
          endDate: "2021-12-09",
        },
        {
          spotId: 6,
          userId: 1,
          startDate: "2021-12-10",
          endDate: "2021-12-11",
        },
        {
          userId: 7,
          spotId: 1,
          startDate: "2021-11-19",
          endDate: "2021-11-20",
        },
        {
          userId: 8,
          spotId: 2,
          startDate: "2021-11-21",
          endDate: "2021-11-22",
        },
        {
          userId: 9,
          spotId: 3,
          startDate: "2021-11-23",
          endDate: "2021-11-24",
        },
        {
          userId: 10,
          spotId: 4,
          startDate: "2021-11-25",
          endDate: "2021-11-26",
        },
        {
          userId: 1,
          spotId: 5,
          startDate: "2021-11-27",
          endDate: "2021-11-28",
        },
        {
          userId: 12,
          spotId: 6,
          startDate: "2021-11-29",
          endDate: "2021-11-30",
        },
        {
          userId: 13,
          spotId: 1,
          startDate: "2021-12-01",
          endDate: "2021-12-02",
        },
        {
          userId: 14,
          spotId: 2,
          startDate: "2021-12-03",
          endDate: "2021-12-04",
        },
        {
          userId: 15,
          spotId: 3,
          startDate: "2021-12-05",
          endDate: "2021-12-06",
        },
        {
          userId: 16,
          spotId: 4,
          startDate: "2021-12-07",
          endDate: "2021-12-08",
        },
        {
          userId: 17,
          spotId: 5,
          startDate: "2021-12-09",
          endDate: "2021-12-10",
        },
        {
          userId: 18,
          spotId: 6,
          startDate: "2021-12-11",
          endDate: "2021-12-12",
        },
        {
          userId: 19,
          spotId: 1,
          startDate: "2021-12-13",
          endDate: "2021-12-14",
        },
        {
          userId: 1,
          spotId: 5,
          startDate: "2023-12-15",
          endDate: "2023-12-16",
        },
        {
          userId: 1,
          spotId: 6,
          startDate: "2023-12-17",
          endDate: "2023-12-18",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.gte]: 1 },
      },
      {}
    );
  },
};
