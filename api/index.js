/* eslint-disable prettier/prettier */
const express = require("express");
const port = 3000;
// const port1 = 3001;
const app = express();
const bodyParser = require("body-parser");

const mongoose = require('mongoose');
// require('dotenv').config();
// process.env.mongo_URL
mongoose.connect('mongodb+srv://ayeshamulla369:ayeshamulla@cluster0.hr3cesv.mongodb.net/').then(
    () => {
        console.log('Connected to database');
    }).catch((err) => {
        console.log('Error connecting to database ' + err);
    });

app.use(bodyParser.json());
const uploadRoutes = require("./routes/uploadRoutes");
app.use(uploadRoutes);



app.get("/", (req, res) => {
    res.send("Root Page ");
  });

app.listen(port, () => {
    console.log("Server is running on port " + port);
  });
