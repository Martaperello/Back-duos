const dotenv = require('dotenv');
const fs = require('fs');
const Product = require('../../models/productModel');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<DATA_PASSWORD>',
  process.env.DATA_PASSWORD
)

mongoose.connect(DB, {
}).then(() => {
  console.log("DB connection successful");
}).catch(err => {
  console.error("DB connection error:", err);
});


const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`));

// Import data into the Database

const importData = async () => {
  try {
    await Product.create(products)
    console.log(`Data sucesfully loaded`);

  } catch (error) {
    console.log(error)
  }
  process.exit();
}


const deleteData = async () => {
  try {
    await Product.deleteMany()
    console.log(`Data sucesfully loaded`);

  } catch (error) {
    console.log(error)
  }
  process.exit();
}


if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData()
}


// To delete and import run the follow command in the shell

// node ./dev-data/data/import-dev-data.js --delete
// node ./dev-data/data/import-dev-data.js --import