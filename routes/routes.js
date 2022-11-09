
const express = require('express');
const db = require("../models/index.js");
const slug = require('slug');
const BBPromise = require('bluebird');
const Op = db.Sequelize.Op;
//   const model = require("../app/routers/routers.js");
  // const product = require("../app/routers/routers.js");
  let router = express.Router();
  //console.log(111);

router.get("/ingredients/listing", (req, res) => {
    const filter = {
      where: {},
      attributes: ['name']
    };
    db.Ingredients.findAll(filter)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving brands."
      });
    });
  });
  
  router.get("/dishes/listing", (req, res) => {
    const options = req.params;
    let ingredientFilter = {};
    let isFilter = false
    if (options.ingredientIds && options.ingredientIds.length) {
      isFilter = true;
      ingredientFilter = {
        id: options.ingredientIds,
      }
    } else if (options.ingredients && options.ingredients.length) {
      isFilter = true;
      ingredientFilter = {
        name: { [Op.in]: options.ingredients },
      }
    }
    const filter = {
      where: {},
      attributes: ['name', 'diet', 'preprationTime', 'cookingTime', 'flavourProfile', 'courseType', 'state', 'region'],
      include: [{
        model: db.DishItem,
        as: 'DIs',
        attributes: ['serialNo'],
        required: isFilter,
        include: [{
          model: db.Ingredients,
          attributes: ['name'],
          where: ingredientFilter
        }]
      }]
    };
    db.Dish.findAll(filter)
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving brands."
      });
    });
  });
  
  
  router.get('/dishes/:dishId', async (req,res) => {
    const { dishId } = req.params;
    const filter = {
      where: {
        id: dishId
      },
      include: [{
        model: db.DishItem,
        as: 'DIs',
        attributes: ['serialNo'],
        include: [{
          model: db.Ingredients,
          attributes: ['name']
        }]
      }]
    }
    const ret = await db.Dish.findOne(filter);
    res.status(200).send(ret);
  })  
  
  const validate = async (values) => {
    let validatedFlag = true;
    if(!values.name) {
      validatedFlag = false
    } else if (!values.diet) {
      validatedFlag = false
    } else if (!values.preprationTime || values.preprationTime < 0) {
      validatedFlag = false
    } else if (!values.cookingTime || values.cookingTime < 0) {
      validatedFlag = false
    } else if (!values.flavourProfile) {
      validatedFlag = false
    } else if (!values.courseType) {
      validatedFlag = false
    } else if (!values.state) {
      validatedFlag = false
    } else if (!values.region) {
      validatedFlag = false
    } else if (!values.ingredients && values.ingredients.length) {
      validatedFlag = false
    } else if (values.dishItems && values.dishItems.length) {
      validatedFlag = false
    }
    return {
      validatedFlag,
    };
  };
  
  const slugify = (val) => {
    if (val === null) {
      return null;
    }
    return slug(val, {
      lower: true,
      remove: null,
    });
  };

  router.post("/dishes/dish", async (req, res) =>{
    const values = req.body;
    const validateFlag = validate(values)
    if(validateFlag) {
      values.slug = slugify(values.name); 
      const dish = await db.Dish.create(values);
        await BBPromise.mapSeries(values.dishItems, (async (di) => {
          di.dishId = dish.id;
          await db.DishItem.create(di);
        }))
      res.status(201).send("Dish successfully added!!");
    }
    else {
      res.status(500).send({
        message: "Enter Ingredient Details"
    });
  }
  });
  
  router.get("/dishes/:dishId/delete", (req, res) => {
    const { dishId } = req.params
    db.Dish.destroy({
      where: {
        id: dishId,
      },
      truncate: false
    })
    db.DishItem.destroy({ where: { dishId } })
      .then(nums => {
        res.status(201).send({ message: `Dish was deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all brands."
        });
      });
  });

  module.exports = router;