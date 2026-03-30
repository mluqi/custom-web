"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SiteSetting extends Model {
    static associate(models) {
      // define association here
    }
  }
  SiteSetting.init(
    {
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      value: DataTypes.TEXT,
      group: DataTypes.STRING,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "SiteSetting",
    },
  );
  return SiteSetting;
};
