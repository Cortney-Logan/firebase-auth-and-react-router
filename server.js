require("dotenv").config(); //allows us to read .env file
const path = require('path')

//express set up
const express = require("express");
const app = express();
app.use(express.static("./client/public"));
app.use(express.urlencoded({ extended: true }));

//to host life serve from 'build' instead of 'public', and don't forget to add the  heroku post build script to package.json
app.get("*", (req,res)=>{
    res.sendFile(path.resolve(('./client/public/index.html')))
})

app.listen(process.env.PORT || 5000, () => {
  console.log("server is running");
});
