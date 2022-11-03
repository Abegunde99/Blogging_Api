const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();

//saving environment variables
const port = process.env.PORT;

//importing database
const connectDB = require("./utils/database");
connectDB();
//connecting to the server
app.listen(port, () => {
  console.log(`connecting to server on port ${port}`);
});
