// const express = require("express");
// const router = express.Router();
// router.use(express.json());

// router.get("/characters", async (req, res) => {
//   console.log(`🔹 Requested route: /characters`);
//   try {
//     response = await getCharacters(req.query);
//     return res.status(200).json(response.data);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// });

// router.get("/character/:characterID", async (req, res) => {
//   console.log(`🔹 Requested route: /character/:characterID`);
//   try {
//     response = await getCharacterByID(req.params);
//     return res.status(200).json(response.data);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;
