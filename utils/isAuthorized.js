const User = require("../models/User");

async function isAuthorized(req, res, then) {
  console.warn("isAuthorized?");

  if (!req?.headers?.authorization) {
    console.log("Missing username or password");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const visitorToken = req.headers.authorization.replace("Bearer ", "");

  try {
    const userQuery = await User.findOne({
      token: visitorToken,
    });

    if (!userQuery) {
      return res.status(401).json({ message: "Unauthorized" });
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
