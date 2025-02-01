const mongoose = require("mongoose");

// mongoose.connect(process.env.MONGODB_URI);

const User = require("./User-model");

async function isAuthorized(req, res, then) {
  console.warn("isAuthorized?");

  if (!req?.headers?.authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const visitorToken = req.headers.authorization.replace("Bearer ", "");

  try {
    const userQuery = await User.findOne({
      token: visitorToken,
    });

    if (!userQuery) {
      throw new Error("Unauthorized");
    }

    console.log("User is", userQuery.username);

    req.user = userQuery;

    then();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

module.exports = isAuthorized;
