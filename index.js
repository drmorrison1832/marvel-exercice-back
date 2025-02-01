const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const app = express();

const {
  getComics,
  getComicsByCharacterID,
  getComicByID,
  getCharacters,
  getCharacterByID,
} = require("./utils/marvel-requests");

const showReq = require("./utils/showReq");
const isAuthorized = require("./utils/isAuthorized");

app.use(cors());
app.use(express.json());
app.use(showReq);

/////////////////// DATA ROUTE ///////////////////

app.get("/comics", async (req, res) => {
  console.log(`🔹 Requested route: /comics`);
  try {
    response = await getComics(req.query);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/comic/:comicID", async (req, res) => {
  console.log(`🔹 Requested route: /comic/:comicID`);
  try {
    response = await getComicByID(req.params);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/comics/:characterID", async (req, res) => {
  console.log(`🔹 Requested route: /comics/:characterID`);
  try {
    response = await getComicsByCharacterID(req.params);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/characters", async (req, res) => {
  console.log(`🔹 Requested route: /characters`);
  try {
    response = await getCharacters(req.query);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/character/:characterID", async (req, res) => {
  console.log(`🔹 Requested route: /character/:characterID`);
  try {
    response = await getCharacterByID(req.params);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/////////////////// USER ACCOUNT MANAGEMENT ///////////////////

const { v4: uuidv4 } = require("uuid");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

const userSchema = new mongoose.Schema({
  username: { type: String },
  salt: String,
  hash: String,
  token: String,
  saved: { comics: Array, characters: Array },
});

// const User = mongoose.model("User", userSchema);
const User = require("./utils/User-model");

////////////////////////////////////////////////////////////////////////////////////////////////
//
// Faire en sorte que si je décide de créer un compte, ça copie mon Local Storage sur mon compte.
//
////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/signup", async (req, res) => {
  console.log(`🔹 Requested route: /signup`);
  try {
    const userQuery = await User.findOne({ username: req.body.username });
    if (userQuery) {
      throw new Error("Username already registered");
    }

    let newUser = new User();
    const newSalt = uuidv4();
    newUser.username = req.body.username;
    newUser.salt = newSalt;
    newUser.hash = SHA256(req.body.password + newSalt).toString(encBase64);
    newUser.token = uuidv4();

    let response = await newUser.save();

    return res.status(201).json({
      message: `Welcome, ${response.username}`,
      username: userQuery.username,
      token: response.token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/login", async (req, res) => {
  console.log(`🔹 Requested route: /login`);

  try {
    const userQuery = await User.findOne({ username: req.body.username });

    if (!userQuery) {
      throw new Error("Wrong user or password");
    }

    let visitorHash = SHA256(req.body.password + userQuery.salt).toString(
      encBase64
    );

    if (visitorHash === userQuery.hash) {
      return res.status(200).json({
        message: `Welcome back, ${userQuery.username}`,
        username: userQuery.username,
        token: userQuery.token,
      });
    } else {
      throw new Error("Wrong user or password");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.put("/save", isAuthorized, async (req, res) => {
  console.log(`🔹 Requested route: /save`);
  const user = req.user;

  if (!req.body.comic && !req.body.character) {
    return res.status(400).json({ message: "Nothing to put" });
  }

  if (
    user.saved.comics.includes(req.body.comic) ||
    user.saved.characters.includes(req.body.character)
  ) {
    return res.status(400).json({ message: "Item already saved" });
  }

  if (req.body.comic) {
    user.saved.comics.push(req.body.comic);
  }
  if (req.body.character) {
    user.saved.characters.push(req.body.character);
  }

  try {
    let response = await user.save();

    return res.status(200).json(response.saved);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
});

app.get("/saved", isAuthorized, async (req, res) => {
  console.log(`🔹 Requested route: /saved`);
  const user = req.user;
  return res.status(200).json(user.saved);
});

app.delete("/unsave", isAuthorized, async (req, res) => {
  console.log(`🔹 Requested route: /unsave`);
  const user = req.user;

  if (!req.body.comic && !req.body.character) {
    return res.status(400).json({ message: "Nothing to unsave" });
  }

  if (req.body.comic) {
    let index = user.saved.comics.indexOf(req.body.comic);
    if ((index = -1)) {
      return res.status(400).json({ message: "Item not found" });
    }
    user.saved.comics.splice(index, 1);
  }
  if (req.body.character) {
    let index = user.saved.characters.indexOf(req.body.character);
    if ((index = -1)) {
      return res.status(400).json({ message: "Item not found" });
    }
    user.saved.characters.splice(index, 1);
  }

  return res.status(200).json(user.saved);
});

app.all("*", (req, res) => {
  return res.status(401).json("Nothing to see here...");
});

app.listen(process.env.PORT || 3200, () => {
  console.log("Serveur started");
});

// app.get("/", async (req, res) => {
//   const { request, characterID, comicID, title, name, limit, page, skip } =
//     req.body;
//   let response;
//   try {
//     switch (request) {
//       case "comics":
//         response = await getComics(req.query);
//         break;
//       case "comicById":
//         response = await getComicByID(comicID);
//         break;
//       case "comicByCharacter":
//         response = await getComicsByCharacterID(characterID);
//       case "characters":
//         response = await getCharacters(name, limit, skip);
//         break;
//       case "characterByID":
//         console.log("Request: characteirByID");
//         response = await getCharacterByID(characterID);
//         break;
//       default:
//         throw new Error("Wrong request");
//     }
//     return res.status(200).json(response.data);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// });
