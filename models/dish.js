'use strict';
module.exports = (sequelize, Sequelize) => {
  const Dish = sequelize.define("Dish", {
    name: {
        type: Sequelize.STRING,
      },
      slug: {
        type: Sequelize.STRING,
      },
      diet: {
        type: Sequelize.STRING,
      },
      preprationTime: {
        type: Sequelize.DECIMAL,
      },
      cookingTime: {
        type: Sequelize.DECIMAL,
      },
      flavourProfile: {
        type: Sequelize.STRING,
      },
      courseType: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      region: {
        type: Sequelize.STRING,
      },
      ingredients: {
        type: Sequelize.JSONB,
        defaultValue: [],
      }
  },
  { timestamps: false}
  );

  Dish.associate = (models) => {
    Dish.hasMany(models.DishItem, {
        foreignKey: 'dishId',
        as: 'DIs',
    });
  };

  return Dish;
};