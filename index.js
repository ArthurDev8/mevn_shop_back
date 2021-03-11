require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const { routes } = require("./src/routes");



mongoose.connect(
  process.env.MONGDB_URL,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
mongoose.set('useFindAndModify', false);
mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected!!!");
});

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes.forEach((item) => {
  app.use(`/${item}`, require(`./src/routes/${item}`));
});



const PORT = process.env.PORT;
http.createServer({}, app).listen(PORT);

console.log(`Server has been started on ${PORT} port.`);
