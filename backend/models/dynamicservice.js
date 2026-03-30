"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DynamicService extends Model {
    static associate(models) {}
  }
  DynamicService.init(
    {
      slug: DataTypes.STRING,
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
      secondary_image: DataTypes.STRING,
      template: DataTypes.STRING,
      features: {
        type: DataTypes.TEXT,
        get() {
          return JSON.parse(this.getDataValue("features") || "[]");
        },
        set(value) {
          this.setDataValue("features", JSON.stringify(value));
        },
      },
      content: {
        type: DataTypes.TEXT,
        get() {
          return JSON.parse(this.getDataValue("content") || "{}");
        },
        set(value) {
          this.setDataValue("content", JSON.stringify(value));
        },
      },
      cta_text: {
        type: DataTypes.TEXT,
        get() {
          return JSON.parse(this.getDataValue("cta_text") || "{}");
        },
        set(value) {
          this.setDataValue("cta_text", JSON.stringify(value));
        },
      },
      cta_link: DataTypes.STRING,
      seo_title: {
        type: DataTypes.TEXT,
        get() {
          return JSON.parse(this.getDataValue("seo_title") || "{}");
        },
        set(value) {
          this.setDataValue("seo_title", JSON.stringify(value));
        },
      },
      seo_description: {
        type: DataTypes.TEXT,
        get() {
          return JSON.parse(this.getDataValue("seo_description") || "{}");
        },
        set(value) {
          this.setDataValue("seo_description", JSON.stringify(value));
        },
      },
    },
    {
      sequelize,
      modelName: "DynamicService",
    },
  );
  return DynamicService;
};
