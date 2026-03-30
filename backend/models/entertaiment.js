'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Entertainment extends Model {
    static associate(models) {
      // define association here
    }
  }
  Entertainment.init({
    category: DataTypes.STRING,
    title: DataTypes.TEXT,
    subtitle: DataTypes.TEXT,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    url: DataTypes.STRING,
    meta: DataTypes.TEXT,
    order: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Entertainment',
  });
  return Entertainment;
};
