//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/secretUserDB");

const userSchema = {
    email: String,
    password: String
};

const User = mongoose.model("User", userSchema);

app.route("/")
    .get(function (req, res) {
        res.render("home");
    });

app.route("/login")
    .get(function (req, res) {
        res.render("login");
    })
    .post(function (req, res) {
        const userName = req.body.userName;
        const password = req.body.password;

        User.findOne({ email: userName }, function (err, foundUser) {
            if (err) {
                console.log(err);
            } else {
                if (foundUser) {
                    if (foundUser.password === password) {
                        res.render("secrets")
                    }
                }
            }
        })
    });

app.route("/register")
    .get(function (req, res) {
        res.render("register");
    })

    .post(function (req, res) {
        const newUser = new User({
            email: req.body.userName,
            password: req.body.password
        });

        newUser.save(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                res.render("secrets")
            }
        })
    });




app.listen(3000, function () {
    console.log("Server started on port 3000");
});
