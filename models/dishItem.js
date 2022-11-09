'use strict';
module.exports = (sequelize, Sequelize) => {
  const DishItem = sequelize.define("DishItem", {
    serialNo: {
        type: Sequelize.INTEGER,
      },
  },
  { timestamps: false}
  );

  DishItem.associate = (models) => {
    DishItem.belongsTo(models.Ingredients, {
        foreignKey: {
          fieldName: 'ingredientId',
        },
      });
      DishItem.belongsTo(models.Dish, {
        foreignKey: {
          fieldName: 'dishId',
        },
      });
  };

  return DishItem;
};