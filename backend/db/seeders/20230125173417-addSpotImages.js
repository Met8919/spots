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
          url: "https://images.unsplash.com/photo-1506126279646-a697353d3166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://images.unsplash.com/photo-1506126279646-a697353d3166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
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
        spotId: { [Op.gte]: 1 },
      },
      {}
    );
  },
};
