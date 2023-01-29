"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.Spot, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
      });
      Review.belongsTo(models.User, { foreignKey: "userId" });

      Review.hasMany(models.ReviewImage, { foreignKey: "reviewId" });
      Review.hasMany(models.ReviewImage, {
        foreignKey: "reviewId",
        as: "ReviewImage",
      });
    }
  }
  Review.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      spotId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      review: {
        type: DataTypes.STRING,
        validate: {
          valid(text) {
            if (!text.length) {
              throw new Error("Review text is required");
            }
          },
        },
      },
      stars: {
        type: DataTypes.INTEGER,
        validate: {
          valid(stars) {
            if (stars < 1 || stars > 5) {
              throw new Error("Stars must be an integer from 1 to 5");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
