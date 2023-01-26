"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    return queryInterface.bulkInsert(
      options,
      [
        {
          email: "demo@user.io",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
          firstName: "John",
          lastName: "Smith",
        },
        {
          email: "user1@user.io",
          username: "FakeUser1",
          hashedPassword: bcrypt.hashSync("password2"),
          firstName: "Emily",
          lastName: "Jones",
        },
        {
          email: "user2@user.io",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password3"),
          firstName: "Alex",
          lastName: "Marron",
        },
        {
          email: "user3@user.io",
          username: "FakeUser3",
          hashedPassword: bcrypt.hashSync("password3"),
          firstName: "Michael",
          lastName: "Williams",
        },
        {
          email: "user4@user.io",
          username: "FakeUser4",
          hashedPassword: bcrypt.hashSync("password3"),
          firstName: "Jessica",
          lastName: "Brown",
        },
        {
          email: "user5@user.io",
          username: "FakeUser5",
          hashedPassword: bcrypt.hashSync("password3"),
          firstName: "Jacob",
          lastName: "Davis",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: [
            "Demo-lition",
            "FakeUser1",
            "FakeUser2",
            "FakeUser3",
            "FakeUser4",
            "FakeUser5",
          ],
        },
      },
      {}
    );
  },
};
