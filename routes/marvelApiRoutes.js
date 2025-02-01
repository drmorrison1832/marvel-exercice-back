const express = require("express");
const router = express.Router();
router.use(express.json());

const {
  getComics,
  getComicsByCharacterID,
  getComicByID,
  getCharacters,
  getCharacterByID,
} = require("../utils/marvel-requests");

router.get("/comics", async (req, res) => {
  console.log(`🔹 Requested route: /comics`);
  try {
    response = await getComics(req.query);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/comic/:comicID", async (req, res) => {
  console.log(`🔹 Requested route: /comic/:comicID`);
  try {
    response = await getComicByID(req.params);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/comics/:characterID", async (req, res) => {
  console.log(`🔹 Requested route: /comics/:characterID`);
  try {
    response = await getComicsByCharacterID(req.params);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/characters", async (req, res) => {
  console.log(`🔹 Requested route: /characters`);
  try {
    response = await getCharacters(req.query);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/character/:characterID", async (req, res) => {
  console.log(`🔹 Requested route: /character/:characterID`);
  try {
    response = await getCharacterByID(req.params);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
