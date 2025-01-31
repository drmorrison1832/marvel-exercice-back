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

app.get("/fetch", async (req, res) => {
  console.log("Route: /");
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

///////////////////

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

app.post("/", async (req, res) => {
  return res.status(200).json("hello");
});

app.all("*", (req, res) => {
  return res.status(401).json("You shouldn't be here...");
});

app.listen(3000, () => {
  console.log("Serveur started");
});
