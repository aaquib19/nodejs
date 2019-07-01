const Sequelize = require('sequelize');

const sequelize = new Sequelize("nodecomplete", "root", "thisisdell", {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
