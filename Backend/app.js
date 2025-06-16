const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();

const port = 3000;

app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());
const userRoutes = require('./Routes/user_routes');

app.use("/user" , userRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});