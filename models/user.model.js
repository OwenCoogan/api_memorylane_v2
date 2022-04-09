const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

const User = sequelize.define("user", {
  firstname: DataTypes.TEXT,
  lastname: DataTypes.TEXT,
  email: DataTypes.TEXT,
});

(async () => {
  await sequelize.sync({ force: true });
})();
