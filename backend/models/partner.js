"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Partner extends Model {
    static associate(models) {
      // define association here
    }
  }
  Partner.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Partner",
    },
  );
  return Partner;
};
