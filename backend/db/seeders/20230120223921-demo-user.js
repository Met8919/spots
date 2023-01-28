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
        {
          email: "user6@user.io",
          username: "FakeUser6",
          hashedPassword: bcrypt.hashSync("password4"),
          firstName: "Sophia",
          lastName: "Miller",
        },
        {
          email: "user7@user.io",
          username: "FakeUser7",
          hashedPassword: bcrypt.hashSync("password5"),
          firstName: "Ethan",
          lastName: "Wilson",
        },
        {
          email: "user8@user.io",
          username: "FakeUser8",
          hashedPassword: bcrypt.hashSync("password6"),
          firstName: "Isabella",
          lastName: "Moore",
        },
        {
          email: "user9@user.io",
          username: "FakeUser9",
          hashedPassword: bcrypt.hashSync("password7"),
          firstName: "Ava",
          lastName: "Taylor",
        },
        {
          email: "user10@user.io",
          username: "FakeUser10",
          hashedPassword: bcrypt.hashSync("password8"),
          firstName: "Noah",
          lastName: "Anderson",
        },
        {
          email: "user11@user.io",
          username: "FakeUser11",
          hashedPassword: bcrypt.hashSync("password9"),
          firstName: "Mia",
          lastName: "Thomas",
        },
        {
          email: "user12@user.io",
          username: "FakeUser12",
          hashedPassword: bcrypt.hashSync("password10"),
          firstName: "Caden",
          lastName: "Jackson",
        },
        {
          email: "user13@user.io",
          username: "FakeUser13",
          hashedPassword: bcrypt.hashSync("password11"),
          firstName: "Landon",
          lastName: "White",
        },
        {
          email: "user14@user.io",
          username: "FakeUser14",
          hashedPassword: bcrypt.hashSync("password12"),
          firstName: "Evelyn",
          lastName: "Harris",
        },
        {
          email: "user15@user.io",
          username: "FakeUser15",
          hashedPassword: bcrypt.hashSync("password13"),
          firstName: "Hannah",
          lastName: "Martin",
        },
        {
          email: "user16@user.io",
          username: "FakeUser16",
          hashedPassword: bcrypt.hashSync("password14"),
          firstName: "Mason",
          lastName: "Thompson",
        },
        {
          email: "user17@user.io",
          username: "FakeUser17",
          hashedPassword: bcrypt.hashSync("password15"),
          firstName: "Harper",
          lastName: "Garcia",
        },
        {
          email: "user18@user.io",
          username: "FakeUser18",
          hashedPassword: bcrypt.hashSync("password16"),
          firstName: "Eli",
          lastName: "Martinez",
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
            "FakeUser6",
            "FakeUser7",
            "FakeUser8",
            "FakeUser9",
            "FakeUser10",
            "FakeUser11",
            "FakeUser12",
            "FakeUser13",
            "FakeUser14",
            "FakeUser15",
            "FakeUser16",
            "FakeUser17",
            "FakeUser18",
          ],
        },
      },
      {}
    );
  },
};
