"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SpotImage.belongsTo(models.Spot, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
      });
    }
  }
  SpotImage.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,

        validate: {
          isNotEmpty(url) {
            if (!url.length || url === null) {
              throw new Error("url required");
            }
          },
        },
      },
      preview: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          isNotEmpty(url) {
            if (url !== false && url !== true) {
              throw new Error("preview must be set");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "SpotImage",
    }
  );
  return SpotImage;
};
