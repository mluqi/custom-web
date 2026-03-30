"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class InternetPageContent extends Model {
    static associate(models) {}
  }
  InternetPageContent.init(
    {
      section: DataTypes.STRING,
      title: {
        type: DataTypes.TEXT,
        get() {
          return JSON.parse(this.getDataValue("title") || "{}");
        },
        set(value) {
          this.setDataValue("title", JSON.stringify(value));
        },
      },
      subtitle: {
        type: DataTypes.TEXT,
        get() {
          return JSON.parse(this.getDataValue("subtitle") || "{}");
        },
        set(value) {
          this.setDataValue("subtitle", JSON.stringify(value));
        },
      },
      description: {
        type: DataTypes.TEXT,
        get() {
          return JSON.parse(this.getDataValue("description") || "{}");
        },
        set(value) {
          this.setDataValue("description", JSON.stringify(value));
        },
      },
      image: DataTypes.STRING,
      items: {
        type: DataTypes.TEXT,
        get() {
          return JSON.parse(this.getDataValue("items") || "[]");
        },
        set(value) {
          this.setDataValue("items", JSON.stringify(value));
        },
      },
      extra_data: {
        type: DataTypes.TEXT,
        get() {
          return JSON.parse(this.getDataValue("extra_data") || "{}");
        },
        set(value) {
          this.setDataValue("extra_data", JSON.stringify(value));
        },
      },
    },
    {
      sequelize,
      modelName: "InternetPageContent",
    },
  );
  return InternetPageContent;
};
