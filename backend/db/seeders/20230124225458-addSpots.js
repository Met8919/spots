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
          address: "1234 Park Ave",
          city: "Los Angeles",
          state: "California",
          country: "United States of America",
          lat: 34.05,
          lng: -118.24,
          name: "The Ritz-Carlton",
          description: "Luxury hotel in the heart of Los Angeles",
          price: 500,
          ownerId: 1,
        },
        {
          address: "567 Oxford St",
          city: "London",
          state: "",
          country: "United Kingdom",
          lat: 51.51,
          lng: -0.13,
          name: "The Savoy",
          description: "Iconic 5-star hotel in London",
          price: 400,
          ownerId: 1,
        },
        {
          address: "789 Queen St W",
          city: "Toronto",
          state: "Ontario",
          country: "Canada",
          lat: 43.65,
          lng: -79.39,
          name: "The Fairmont Royal York",
          description: "Elegant hotel in the heart of Toronto",
          price: 300,
          ownerId: 4,
        },
        {
          address: "456 Main St",
          city: "New York City",
          state: "New York",
          country: "United States of America",
          lat: 40.71,
          lng: -74.01,
          name: "The Plaza Hotel",
          description: "Luxurious hotel with a rich history in New York City",
          price: 600,
          ownerId: 5,
        },
        {
          address: "98765 Ocean Dr",
          city: "Miami Beach",
          state: "Florida",
          country: "United States of America",
          lat: 25.79,
          lng: -80.13,
          name: "The Fontainebleau Miami Beach",
          description: "Stunning beachfront hotel with world-class amenities",
          price: 450,
          ownerId: 5,
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
        ownerId: { [Op.in]: [1, 2, 3, 4, 5] },
      },
      {}
    );
  },
};
