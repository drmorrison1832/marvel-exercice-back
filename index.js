const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const app = express();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(express.json());
const showReq = require("./utils/showReq");
app.use(showReq);
const marvelApiRoutes = require("./routes/marvelApiRoutes");
app.use(marvelApiRoutes);

const userRoutes = require("./routes/userRoutes");
app.use(userRoutes);

const saveRoutes = require("./routes/saveRoutes");
app.use(saveRoutes);

////////////////////////////////////////////////////////////////////////////////////////////////
//
// Faire en sorte que si je décide de créer un compte, ça copie mon Local Storage sur mon compte.
//
////////////////////////////////////////////////////////////////////////////////////////////////

app.all("*", (req, res) => {
  return res.status(401).json("Nothing to see here...");
});

app.listen(process.env.PORT || 3200, () => {
  console.log("Serveur started");
});
