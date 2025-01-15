const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require("./app");

const DB = process.env.DATABASE.replace('<DATA_PASSWORD>', process.env.DATA_PASSWORD);


mongoose.connect(DB, {
}).then(() => {
  console.log("DB connection successful");
}).catch(err => {
  console.error("DB connection error:", err);
});

const port = process.env.PORT || 8000;

const server = app.listen(port, () => console.log(`Listening on port ${port}`));
