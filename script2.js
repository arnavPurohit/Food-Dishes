const db = require("./models");

const excel = require('exceljs');
const BBPromise = require('bluebird');
const slug = require('slug');


// const customerId = 1; // update with Cipla CustomerId
// const auth = {
//   customerId : 1,
// }

const bulkCreate = async (values) => {
  const dish = await db.Dish.create(values);
  console.log(dish);
  await BBPromise.mapSeries(values.dishItems, (async (di) => {
    di.dishId = dish.id;
    const dishItem = await db.DishItem.create(di);
  }))
  return {
    dish,
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

// const userId = 427;

const run = async () => {
  const productRecords = [];
  const workbook = new excel.Workbook();
  await workbook.xlsx.readFile('indian_food.xlsx').then(async () => {
    const worksheet = workbook.getWorksheet('trial');
    const products = worksheet.getColumn('A');
    products.eachCell((cell, colNumber) => {
      if (colNumber > 1 && colNumber < 3) {
        const name = cell.value;
        const slug = slugify(name);
        const ingredients = worksheet.getCell(`B${colNumber}`).value;
        const diet = worksheet.getCell(`C${colNumber}`).value;
        const preprationTime = worksheet.getCell(`D${colNumber}`).value !== -1 ? worksheet.getCell(`D${colNumber}`).value : 0;
        const cookingTime = worksheet.getCell(`E${colNumber}`).value !== -1 ? worksheet.getCell(`E${colNumber}`).value : 0;
        const flavourProfile = worksheet.getCell(`F${colNumber}`).value !== -1 ? worksheet.getCell(`F${colNumber}`).value : null;
        const courseType = worksheet.getCell(`G${colNumber}`).value;
        const state = worksheet.getCell(`H${colNumber}`).value !== -1 ? worksheet.getCell(`H${colNumber}`).value : null;
        const region = worksheet.getCell(`I${colNumber}`).value !== -1 ? worksheet.getCell(`I${colNumber}`).value : null;
        const record = {
          name,
          slug,
          ingredients: ingredients.split(','),
          diet,
          preprationTime,
          cookingTime,
          flavourProfile,
          courseType,
          state,
          region,
        };
        productRecords.push(record);
      }
    });
    console.log('productRecords',productRecords);
    const temp = new Set();
    await BBPromise.mapSeries(productRecords, (async (pR) => {
      const dishItems = [];
      await BBPromise.mapSeries(pR.ingredients, (async (ad, index) => {
          console.log('ad',ad);
          const brandValue = await db.Ingredients.findOne({where: { slug: slugify(ad)}});
            dishItems.push({
              serialNo: index+1,
              ingredientId: brandValue.id,
            })
        pR.dishItems = dishItems;
      }))
        console.log('pr',pR);
    }))
    console.log('productRecords',productRecords);
    let aa = 0;
    await BBPromise.mapSeries(productRecords, (async (pt) => {
      await bulkCreate(pt);
      aa += 1;
    }));
    console.log('aa',aa);
  });
  console.log('END!!!!');
};

run();
