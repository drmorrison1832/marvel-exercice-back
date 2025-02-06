const express = require("express");
const router = express.Router();
const isAuthorized = require("../utils/isAuthorized");
// router.use(isAuthorized); // Ça s'applique à toutes les routes...

router.put("/save", isAuthorized, async (req, res) => {
  console.log(`🔹 Requested route: /save`);
  const user = req.user;

  if (!req.body.comic && !req.body.character) {
    return res.status(400).json({ message: "Nothing to put" });
  }

  if (
    user.saved.comics.includes(req.body.comic) ||
    user.saved.characters.includes(req.body.character)
  ) {
    return res
      .status(400)
      .json({ message: "Item already saved", saved: user.saved });
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

router.get("/saved", isAuthorized, async (req, res) => {
  console.log(`🔹 Requested route: /saved`);
  const user = req.user;
  return res.status(200).json(user.saved);
});

router.delete("/unsave", isAuthorized, async (req, res) => {
  console.log(`🔹 Requested route: /unsave`);
  const user = req.user;

  if (!req.body.comic && !req.body.character) {
    console.error("Nothing to unsave");
    return res.status(400).json({ message: "Nothing to unsave" });
  }

  if (req.body.comic) {
    let index = user.saved.comics.indexOf(req.body.comic);

    if (index === -1) {
      console.error("Comic not found");
      return res
        .status(400)
        .json({ message: "Item not found", saved: user.saved });
    }
    user.saved.comics.splice(index, 1);
  }
  if (req.body.character) {
    let index = user.saved.characters.indexOf(req.body.character);
    if (index === -1) {
      console.error("Character not found");
      return res
        .status(400)
        .json({ message: "Item not found", saved: user.saved });
    }
    user.saved.characters.splice(index, 1);
  }

  try {
    let response = await user.save();
    console.log("reponse is", response);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }

  return res.status(200).json(user.saved);
});

module.exports = router;
