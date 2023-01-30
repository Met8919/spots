"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "SpotImages";
    return queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          url: "image url",
          preview: true,
        },
        {
          spotId: 2,
          url: "image url",
          preview: true,
        },
        {
          spotId: 3,
          url: "image url",
          preview: true,
        },
        {
          spotId: 4,
          url: "image url",
          preview: true,
        },
        {
          spotId: 5,
          url: "image url",
          preview: true,
        },
        {
          spotId: 6,
          url: "image url",
          preview: true,
        },
        {
          spotId: 1,
          url: "image url",
          preview: true,
        },
        {
          spotId: 1,
          url: "image url",
          preview: true,
        },
        {
          spotId: 7,
          url: "image url",
          preview: true,
        },
        {
          spotId: 8,
          url: "image url",
          preview: true,
        },
        {
          spotId: 9,
          url: "image url",
          preview: true,
        },
        {
          spotId: 10,
          url: "image url",
          preview: true,
        },
        {
          spotId: 11,
          url: "image url",
          preview: true,
        },
        {
          spotId: 12,
          url: "image url",
          preview: true,
        },
        {
          spotId: 13,
          url: "image url",
          preview: true,
        },
        {
          spotId: 14,
          url: "image url",
          preview: true,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3, 4, 5, 6] },
      },
      {}
    );
  },
};
