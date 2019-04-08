// export PORT=5000 // Mac
// set PORT=5000 // Windows
// ||

const express = require("express");
const app = express();
const Joi = require("joi"); // data valæidation
const cors = require("cors"); // Access
var bodyParser = require("body-parser");
const moment = require('moment') // data formats

const uuid = require('uuid');
// dummy-data
const profiles = require("./data/accounts")
const posts = require("./data/posts")


app.use(cors());
// configure the app to use bodyParser()
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

// Routes

// Hello world -------------------------------------------
app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

// posts ------------------------------------------------

app.get("/api/posts", (req, res) => {
  res.send(posts);
});

app.post("/api/post", (req, res) => {

  const post = {
    id: profiles.length + 1,
    profileName: req.body.profileName,
    dateTime: moment().format("llll"),  
    message: req.body.message
  };

  posts.push(post);
  res.send(posts);
});



// Account ---------------------------------------------------

app.get("/api/account/:id", (req, res) => {
  const account = profiles.find(c => c.id === req.params.id);
  if (!account)
    return res.sendStatus(404) // 404 = not found 

  res.send(account);
});

app.post("/api/account", (req, res) => {

  const exists = profiles.find(c => c.name === req.body.name) === undefined ? false : true;
  if (exists)
    return res.sendStatus(400) // 400 = Bad request

  let generatedID = profiles.length + 1 + uuid.v4() 
  const profile = {
    id: generatedID.toString(),
    name: req.body.name,
    image: "",
    age: req.body.age,
    text: req.body.text
  };

  profiles.push(profile);
  res.send(profile);
});

app.put("/api/profiles/:id", (req, res) => {
  const profile = profiles.find(c => c.id === req.params.id);
  if (!profile)
    return res.sendStatus(404) // 404 = not found 

  const {
    error
  } = validateProfile(req.body);

  if (error) return res.status(400).send(result.error);

  profile.name = req.body.name;
  res.send(profile);
});

app.delete("/api/profiles/:id", (req, res) => {
  const profile = profiles.find(c => c.id === req.params.id);
  if (!profile)
    return res.status(404).send("Profile with the give id was not found");

  const index = profiles.indexOf(profile);
  profiles.splice(index, 1);
  res.send(profile);
});


// accounts --------------------------------------------------

// all accounts
app.get("/api/accounts", (req, res) => {
  res.send(profiles);
});

app.get("/api/auth/:username", (req, res) => {
  const profile = profiles.find(c => c.name.toLowerCase() === req.params.username.toLowerCase());
  if (!profile)
    return res.sendStatus(404); //404 = Not found
  res.send(profile);
});

app.get("/api/profiles/:id", (req, res) => {
  const profile = profiles.find(c => c.id === parseInt(req.params.id));
  if (!profile)
    return res.sendStatus(404); //404 = Not found
  res.send(profile);
});



function validateProfile(profile) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required(),
    age: Joi.required()
  };

  const result = Joi.validate(profile, schema);

  return result;
}

//const port = process.env.PORT || 3000; // For Mac

// For Windows
let port = 5000;
var server = app.listen(port);

app.listen(server, () => console.log(`Listening on port ${port}`));