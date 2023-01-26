"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "ReviewImages";
    return queryInterface.bulkInsert(
      options,
      [
        { reviewId: 1, url: "image url" },
        { reviewId: 2, url: "image url" },
        { reviewId: 3, url: "image url" },
        { reviewId: 4, url: "image url" },
        { reviewId: 5, url: "image url" },
        { reviewId: 6, url: "image url" },
        { reviewId: 7, url: "image url" },
        { reviewId: 8, url: "image url" },
        { reviewId: 9, url: "image url" },
        { reviewId: 10, url: "image url" },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "ReviewImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        reviewId: { [Op.gte]: 1 },
      },
      {}
    );
  },
};
