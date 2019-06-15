// export PORT=5000 // Mac
// set PORT=5000 // Windows

const express = require("express");
const app = express();
const cors = require("cors"); // Access
var bodyParser = require("body-parser");
const moment = require('moment') // data formats

const uuid = require('uuid');
// dummy-data
const accounts = require("./data/accounts")
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
    id: accounts.length + 1,
    profileName: req.body.accountName,
    dateTime: moment().format("llll"),  
    message: req.body.message
  };

  posts.push(post);
  res.send(posts);
});


// Accounts ---------------------------------------------------
app.get("/api/account/:id", (req, res) => {
  const account = accounts.find(c => c.id === req.params.id);
  if (!account)
    return res.sendStatus(404) // 404 = not found 

  res.send(account);
});

// create account
app.post("/api/account", (req, res) => {

  const exists = accounts.find(c => c.name === req.body.name) === undefined ? false : true;
  if (exists)
    return res.sendStatus(400) // 400 = Bad request

  let generatedID = accounts.length + 1 + uuid.v4() 
  const account = {
    id: generatedID.toString(),
    name: req.body.name,
    password: req.body.password,
    image: "",
    age: req.body.age,
    occupation: req.body.occupation,
    region: req.body.region,
    text: req.body.text
  };

  accounts.push(account);
  res.send(account);
});

// update account
app.put("/api/account/:id", (req, res) => {
  const account = accounts.find(c => c.id === req.params.id);

  if (!account)
    return res.sendStatus(404) // 404 = not found 
  
  account.name = req.body.name;
  account.password = req.body.password; // skal det sendes med
  account.age = req.body.age;
  account.occupation = req.body.occupation;
  account.region = req.body.region;
  account.text = req.body.text;
  
  res.send(account);
});

app.delete("/api/accounts/:id", (req, res) => {
  const profile = accounts.find(c => c.id === req.params.id);
  if (!profile)
    return res.sendStatus(404)

  const index = accounts.indexOf(profile);
  accounts.splice(index, 1);
  res.send(profile);
});


// accounts --------------------------------------------------

// all accounts
app.get("/api/accounts", (req, res) => {
  res.send(accounts);
});


app.get("/api/auth/", (req, res) => {
  const account = accounts.find(x => x.name.toLocaleLowerCase() === req.headers.username.toLowerCase())
  
  // validate login 
  if (!account)
    return res.sendStatus(404); // not found 
  if (account.password.toString() === req.headers.token.toString())
    return res.send(account);
  else 
    return res.sendStatus(401) // bad request    
});

// app.get("/api/auth/:username", (req, res) => {
//   const account = accounts.find(c => c.name.toLowerCase() === req.params.username.toLowerCase());
//   if (!account)
//     return res.sendStatus(404); //404 = Not found
//   res.send(account);
// });



// MAC
//const port = process.env.PORT || 3000; // For Mac

// For Windows
let port = 5000;
var server = app.listen(port);

app.listen(server, () => console.log(`Listening on port ${port}`));