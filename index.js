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

app.use(cors());
app.use(express.json());
app.use(showReq);

/////////////////// DATA ROUTE ///////////////////

app.get("/", async (req, res) => {
  console.log("Route GET");
  const { request, characterID, comicID, title, name, limit, page, skip } =
    req.body;
  let response;
  try {
    switch (request) {
      case "comics":
        response = await getComics(title, limit, skip);
        break;
      case "comicById":
        response = await getComicByID(comicID);
        break;
      case "comicByCharacter":
        response = await getComicsByCharacterID(characterID);
      case "characters":
        response = await getCharacters(name, limit, skip);
        break;
      case "characterByID":
        response = await getCharacterByID(characterID);
        break;
      default:
        throw new Error("Wrong request");
    }
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/////////////////// USER ACCOUNT ///////////////////

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
  favorits: { comics: Array, characters: Array },
});

const User = mongoose.model("User", userSchema);

app.post("/", async (req, res) => {
  console.log("Route POST");
  try {
    const userQuery = await User.findOne({ username: req.body.username });

    switch (req.body.request) {
      case "signup":
        if (userQuery) {
          throw new Error("Username already exists");
        }

        let newUser = new User();
        const newSalt = uuidv4();
        newUser.username = req.body.username;
        newUser.salt = newSalt;
        newUser.hash = SHA256(req.body.password + newSalt).toString(encBase64);
        newUser.token = uuidv4();

        await newUser.save();
        return res.status(200).json({
          message: `Welcome, ${newUser.username}`,
          token: newUser.token,
        });

      case "login":
        if (!userQuery) {
          throw new Error("Wrong user or password");
        }

        if (
          SHA256(req.body.password + userQuery.salt).toString(encBase64) ===
          userQuery.hash
        ) {
          return res.status(200).json({
            message: `Welcome back, ${userQuery.username}`,
            token: userQuery.token,
          });
        } else {
          throw new Error("Wrong user or password");
        }

      default:
        throw new Error("Wrong request");
    }

    return res.status(200).json({ message: `Welcome, ${newUser.username}` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  return res.status(401).json("Nothing to see here...");
});

app.listen(process.env.PORT || 3200, () => {
  console.log("Serveur started");
});
