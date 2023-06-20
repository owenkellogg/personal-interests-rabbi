'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PersonalInterest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PersonalInterest.init({
    txid: DataTypes.STRING,
    txhex: DataTypes.TEXT,
    pubKey: DataTypes.STRING,
    topic: DataTypes.STRING,
    spend_txid: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PersonalInterest',
  });
  return PersonalInterest;
};
