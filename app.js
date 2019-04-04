// export PORT=5000
// ||

const express = require("express");
const Joi = require("joi");
const cors = require("cors");
var bodyParser = require("body-parser");
const app = express();

app.use(cors());
// configure the app to use bodyParser()
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

const posts = [{
  id: 1,
  profileName: "App man",
  dateTime: "04-03-2019",
  message: "Velkommen til forumet"
}];

const profiles = [{
    id: 1,
    name: "Rikke",
    age: 33,
    image: "rikke23022019",
    description: "Jeg er ..."
  },
  {
    id: 2,
    name: "Jens",
    age: 37,
    image: "jens23022019",
    description: "tekst"
  },
  {
    id: 3,
    name: "Bente",
    age: 54,
    image: "bente23022019",
    description: "Velkommen til min profil ...."
  },
  {
    id: 4,
    name: "John",
    age: 50,
    image: "john23022019",
    description: "Profiltekst"
  },
  {
    id: 5,
    name: "Bjarne",
    age: 70,
    image: "bjarne23022019",
    description: "Profiltekst ..."
  }
];

// Hello world -------------------------------------------
app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

// posts ------------------------------------------------
app.get("/api/posts", (req, res) => {
  res.send(posts);
});

app.post("/api/post", (req, res) => {
  //const { error } = validateProfile(req.body);

  /*if (error) return;
  res.status(400).send(result.error);
  */

  const post = {
    id: profiles.length + 1,
    profileName: req.body.profileName,
    dateTime: "14-03-2019", // Forkert dato 
    message: req.body.message
  };

  posts.push(post);
  res.send(posts);
});

// profiles --------------------------------------------------

app.get("/api/profiles", (req, res) => {
  res.send(profiles);
});

app.get("/api/profiles/:id", (req, res) => {
  const profile = profiles.find(c => c.id === parseInt(req.params.id));
  if (!profile)
    return res.sendStatus(404); //404 = Not found
  res.send(profile);
});

app.get("/api/auth/:username", (req, res) => {
  const profile = profiles.find(c => c.name === req.params.username);
  if (!profile)
    return res.sendStatus(404); //404 = Not found
  res.send(profile);
});

app.post("/api/profiles", (req, res) => {

  const exists = profiles.find(c => c.name === req.body.name) === undefined ? false : true;
  if (exists)
    return res.sendStatus(400) // 400 = Bad request

  const profile = {
    id: profiles.length + 1,
    name: req.body.name,
    image: "",
    age: req.body.age,
    description: ""
  };

  profiles.push(profile);
  res.send(profile);

});

app.put("/api/profiles/:id", (req, res) => {
  const profile = profiles.find(c => c.id === parseInt(req.params.id));
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
  const profile = profiles.find(c => c.id === parseInt(req.params.id));
  if (!profile)
    return res.status(404).send("Profile with the give id was not found");

  const index = profiles.indexOf(profile);
  profiles.splice(index, 1);
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

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));