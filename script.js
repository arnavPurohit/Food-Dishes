const db = require("./models");
const excel = require('exceljs');
const BBPromise = require('bluebird');
const slug = require('slug');


const customerId = 1; // update with Cipla CustomerId


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
    const products = worksheet.getColumn('B');
    products.eachCell((cell, colNumber) => {
      if (colNumber > 1) {
        const name = cell.value;
        const record = {
          name: name.split(','),
        };
        productRecords.push(record);
      }
    });
    console.log('productRecords',productRecords.length);
    const temp = new Set();
    const slugtemp = new Set();
    productRecords.forEach(pR => {
      pR.name.forEach(ad => {
        temp.add(ad.trim());
        slugtemp.add((slugify(ad.trim())));
      })
    })
    const temp1 = [...temp];
    console.log('temp1',temp1);
    await BBPromise.mapSeries(temp1, (async (tp) => {
      await db.Ingredients.create({
        name: tp,
        slug: slugify(tp),
      })
    }));
  });
  console.log('END!!!!');
};

run();
