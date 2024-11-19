const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Event = require("./event");

const Reservation = sequelize.define("Reservation", {
  userName: { type: DataTypes.STRING, allowNull: false },
  tickets: { type: DataTypes.INTEGER, allowNull: false },
});

Reservation.belongsTo(Event);
module.exports = Reservation;
