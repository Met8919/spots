"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Spots";
    return queryInterface.bulkInsert(
      options,
      [
        {
          address: "123 Disney Lane",
          city: "San Francisco",
          state: "California",
          country: "United States of America",
          lat: 37.76,
          lng: -122.47,
          name: "App Academy",
          description: "Place where web developers are created",
          price: 123,
          ownerId: 1,
        },
        {
          address: "456 Main St",
          city: "New York City",
          state: "New York",
          country: "United States of America",
          lat: 40.71,
          lng: -74.01,
          name: "Big Tech Inc",
          description: "Leading technology company in the industry",
          price: 456,
          ownerId: 2,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        ownerId: { [Op.in]: [1, 2] },
      },
      {}
    );
  },
};
