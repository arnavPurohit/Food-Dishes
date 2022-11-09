'use strict';
module.exports = (sequelize, Sequelize) => {
  const Ingredients = sequelize.define("Ingredients", {
    name: {
        type: Sequelize.STRING,
      },
      slug: {
        type: Sequelize.STRING,
      },
  },
  { timestamps: false}
  );

  return Ingredients;
};