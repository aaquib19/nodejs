// const Sequelize = require("sequelize");

// const sequelize = require("../util/database");

// const Cart = sequelize.define("cart", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   }
// });

// module.exports = Cart;

const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;
