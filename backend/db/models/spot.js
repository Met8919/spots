"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsToMany(models.User, {
        through: "Booking",
        foreignKey: "spotId",
        otherKey: "userId",
      });
      Spot.belongsToMany(models.User, {
        through: "Review",
        foreignKey: "spotId",
        otherKey: "userId",
      });

      Spot.belongsTo(models.User, { foreignKey: "ownerId", as: "owner" });

      Spot.hasMany(models.SpotImage, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        as: "previewImage",
      });
      Spot.hasMany(models.SpotImage, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
      });

      Spot.hasMany(models.Review, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
      });

      Spot.hasMany(models.Booking, { foreignKey: "spotId" });
    }
  }
  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,

        validate: {
          notEmpty(value) {
            if (!value) {
              throw new Error("Street adress is required");
            }
          },
        },
      },
      city: {
        type: DataTypes.STRING,

        validate: {
          notEmpty(value) {
            if (!value) {
              throw new Error("City is required");
            }
          },
        },
      },
      state: {
        type: DataTypes.STRING,

        validate: {
          notEmpty(value) {
            if (!value) {
              throw new Error("State is required");
            }
          },
        },
      },
      country: {
        type: DataTypes.STRING,

        validate: {
          notEmpty(value) {
            if (!value) {
              throw new Error("Country is required");
            }
          },
        },
      },
      lat: {
        type: DataTypes.DECIMAL,
        validate: {
          inRange(value) {
            if (value < -90 || value > 90 || typeof value !== "number") {
              throw new Error("Latitude is not valid");
            }
          },
        },
      },
      lng: {
        type: DataTypes.DECIMAL,
        validate: {
          inRange(value) {
            if (value < -180 || value > 180 || typeof value !== "number") {
              throw new Error("Longitude is not valid");
            }
          },
        },
      },
      name: {
        type: DataTypes.STRING,

        validate: {
          lessThan50Chars(value) {
            if (value.length > 49) {
              throw new Error("Name must be less than 50 characters");
            }
          },
          nameExists(value) {
            if (value.length < 1 || value === null) {
              throw new Error("Name required");
            }
          },
        },
      },
      description: {
        type: DataTypes.STRING,

        validate: {
          notEmpty(value) {
            if (!value) {
              throw new Error("Description is required");
            }
          },
        },
      },
      price: {
        type: DataTypes.DECIMAL,

        validate: {
          notEmpty(value) {
            if (!value) {
              throw new Error("Price per day is required");
            }

            
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};
