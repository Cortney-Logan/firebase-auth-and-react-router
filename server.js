require("dotenv").config(); //allows us to read .env file

//firebase import
const admin = require("firebase-admin");
const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");

//express set up
const express = require("express");
const app = express();
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));

//firebase config settings - we'll use this to set up our firebase connections
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: "first-example-project-73c9e.firebaseapp.com",
  projectId: "first-example-project-73c9e",
  storageBucket: "first-example-project-73c9e.appspot.com",
  messagingSenderId: "1007056047942",
  appId: "1:1007056047942:web:7fe015dd56e26750e4df47",
  measurementId: "G-8PGDEYL0F2",
};

//setup firebase instance & connections - now server is set up to talk to firebase app
firebase.initializeApp(firebaseConfig);

app.post("/login", async (req, res) => {
  let formSub = req.body;

  const userObj = await firebase
    .auth()
    .signInWithEmailAndPassword(formSub.email, formSub.password)
    .catch((err) => {
      if (err) {
        res.send(err.message);
      }
    });

  if (userObj) {
    res.redirect("/dashboard");
  }
});

//setting up a restricted route
app.get("/dashboard", (req, res) => {
  if (firebase.auth().currentUser) {
    res.send("Welcome back!");
  } else {
    res.redirect("/");
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("server is running");
});
