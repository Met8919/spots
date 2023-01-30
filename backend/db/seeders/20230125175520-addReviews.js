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
          userId: 1,
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
        {
          userId: 7,
          spotId: 1,
          review: "Nice spot with great views",
          stars: 4,
        },
        {
          userId: 8,
          spotId: 2,
          review: "A bit noisy but good overall",
          stars: 3,
        },
        {
          userId: 9,
          spotId: 3,
          review: "Great spot for events",
          stars: 5,
        },
        {
          userId: 10,
          spotId: 4,
          review: "Convenient location",
          stars: 4,
        },
        {
          userId: 11,
          spotId: 5,
          review: "Service could be better",
          stars: 3,
        },
        {
          userId: 12,
          spotId: 6,
          review: "Would recommend",
          stars: 4,
        },
        {
          userId: 13,
          spotId: 1,
          review: "Great for families",
          stars: 4,
        },
        {
          userId: 14,
          spotId: 2,
          review: "Nice spot for a picnic",
          stars: 4,
        },
        {
          userId: 15,
          spotId: 3,
          review: "A bit expensive",
          stars: 3,
        },
        {
          userId: 16,
          spotId: 4,
          review: "Good spot for group gatherings",
          stars: 4,
        },
        {
          userId: 17,
          spotId: 5,
          review: "Great spot for a date night",
          stars: 5,
        },
        {
          userId: 18,
          spotId: 6,
          review: "Nice spot for a workout",
          stars: 4,
        },
        {
          userId: 19,
          spotId: 1,
          review: "Good for a quick stop",
          stars: 3,
        },
        {
          userId: 7,
          spotId: 2,
          review: "Beautiful spot",
          stars: 5,
        },
        {
          userId: 3,
          spotId: 10,
          review: "Great location and comfortable stay",
          stars: 5,
        },
        {
          userId: 1,
          spotId: 17,
          review: "The view from the property was amazing",
          stars: 4,
        },
        {
          userId: 4,
          spotId: 14,
          review: "Host was very helpful and friendly",
          stars: 5,
        },
        {
          userId: 2,
          spotId: 19,
          review: "The spot was clean and spacious",
          stars: 4,
        },
        {
          userId: 5,
          spotId: 20,
          review: "Had a great time at this spot",
          stars: 5,
        },
        {
          userId: 6,
          spotId: 9,
          review: "The place was just okay",
          stars: 3,
        },
        {
          userId: 1,
          spotId: 11,
          review: "The property was well-maintained",
          stars: 4,
        },
        {
          userId: 2,
          spotId: 8,
          review: "The spot was in a quiet area",
          stars: 4,
        },
        {
          userId: 3,
          spotId: 12,
          review: "Had a comfortable stay at this spot",
          stars: 4,
        },
        {
          userId: 4,
          spotId: 15,
          review: "The spot was conveniently located",
          stars: 4,
        },
        {
          userId: 5,
          spotId: 18,
          review: "The spot was exactly as described",
          stars: 5,
        },
        {
          userId: 6,
          spotId: 22,
          review: "Had a good experience staying at this spot",
          stars: 4,
        },
        {
          userId: 4,
          spotId: 7,
          review: "The spot was a bit outdated",
          stars: 3,
        },
        {
          userId: 3,
          spotId: 16,
          review: "The spot was in a great location",
          stars: 4,
        },
        {
          userId: 2,
          spotId: 13,
          review: "Had a pleasant stay at this spot",
          stars: 4,
        },
        {
          userId: 1,
          spotId: 21,
          review: "The spot had all the necessary amenities",
          stars: 4,
        },
        {
          userId: 5,
          spotId: 14,
          review: "The host was very accommodating",
          stars: 5,
        },
        {
          userId: 6,
          spotId: 8,
          review: "The spot was well-equipped",
          stars: 4,
        },
        {
          userId: 4,
          spotId: 19,
          review: "The spot was comfortable and cozy",
          stars: 4,
        },
        {
          userId: 2,
          spotId: 22,
          review: "The location was great",
          stars: 4,
        },
        {
          userId: 6,
          spotId: 19,
          review: "The view from the property was stunning",
          stars: 5,
        },
        {
          userId: 1,
          spotId: 17,
          review: "The place was clean and well maintained",
          stars: 4,
        },
        {
          userId: 4,
          spotId: 21,
          review: "The host was very friendly and accommodating",
          stars: 5,
        },
        {
          userId: 3,
          spotId: 18,
          review:
            "The space was comfortable and had all the amenities we needed",
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
