const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/model/connection");
const router = require("./src/routes/routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    credentials: true,
    origin: ["https://proj-invoice.netlify.app", "http://localhost:3000"],
  })
);

app.use(cookieParser());

app.use(router);

connectDB()
  .then((port) => {
    app.listen(port, "0.0.0.0");
  })
  .catch((err) => console.log(err));
