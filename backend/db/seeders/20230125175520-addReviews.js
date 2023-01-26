"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Reviews";
    return queryInterface.bulkInsert(
      options,
      [
        // {
        //   userId: 1,
        //   spotId: 1,
        //   review: "This was an awesome spot!",
        //   stars: 5,
        // },
        {
          userId: 2,
          spotId: 1,
          review: "I had a great time at this spot.",
          stars: 4,
        },
        {
          userId: 3,
          spotId: 1,
          review: "This spot was okay.",
          stars: 3,
        },
        {
          userId: 2,
          spotId: 2,
          review: "This spot was okay.",
          stars: 3,
        }, //
        {
          userId: 3,
          spotId: 2,
          review: "The spot was perfect for my needs. Highly recommend it.",
          stars: 5,
        },
        {
          userId: 4,
          spotId: 3,
          review: "The spot was not as clean as I would have liked.",
          stars: 3,
        },
        {
          userId: 2,
          spotId: 4,
          review: "The spot had a great view and was in a great location.",
          stars: 4,
        },
        {
          userId: 1,
          spotId: 5,
          review: "I was disappointed with the service at this spot.",
          stars: 2,
        },
        {
          userId: 4,
          spotId: 6,
          review:
            "I had an amazing experience at this spot. Highly recommend it.",
          stars: 5,
        },
        {
          userId: 3,
          spotId: 1,
          review: "The spot was okay, nothing special.",
          stars: 3,
        },
        {
          userId: 3,
          spotId: 2,
          review: "The spot had everything I needed and the staff was helpful.",
          stars: 4,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Reviews";
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
