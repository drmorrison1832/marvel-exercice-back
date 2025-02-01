const marvelApiKey = process.env.MARVEL_API_KEY;

const axios = require("axios");

// Get comics
async function getComics(query) {
  console.log("🔹 Retrieving comics...");

  const title = query.title || "";
  let limit = query.limit || 100;
  if (!Number(limit) || limit < 1 || limit > 100) {
    limit = 100;
  }
  let skip = query.skip || 0;
  if (!Number(skip) || skip < 0) {
    skip = 0;
  }

  try {
    let response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/?title=${title}&limit=${limit}&skip=${skip}&apiKey=${marvelApiKey}`
    );
    console.log("🔹 All good");

    if (response.data.count > 0 && skip >= response.data.count) {
      let newQuery = query;
      newQuery.skip = response.data.count - 1;
      response = getComics(newQuery);
    }

    return response;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

// Get comic by Comic ID
async function getComicByID(params) {
  console.log("🔹 Retrieving comic by ID...");

  const comicID = params.comicID || "";

  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comic/${comicID}?apiKey=${marvelApiKey}`
    );
    console.log("All good");
    return response;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

// Get comics by Character ID
async function getComicsByCharacterID(params) {
  console.log("🔹 Retrieving comics by character ID...");
  const characterID = params.characterID || "";

  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${characterID}?apiKey=${marvelApiKey}`
    );
    console.log("All good");
    return response;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

// Get characters
async function getCharacters(query) {
  console.log("🔹 Retrieving characters...");

  const name = query.name || "";
  let limit = query.limit || 100;
  if (!Number(limit) || limit < 1 || limit > 100) {
    limit = 100;
  }
  let skip = query.skip || 0;
  if (!Number(skip) || skip < 0) {
    skip = 0;
  }

  try {
    let response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?&name=${name}&limit=${limit}&skip=${skip}&apiKey=${marvelApiKey}`
    );
    console.log("All good");

    if (response.data.count > 0 && skip >= response.data.count) {
      let newQuery = query;
      newQuery.skip = response.data.count - 1;
      response = getCharacters(newQuery);
    }

    return response;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

// Get character by ID
async function getCharacterByID(params) {
  console.log("🔹 Retrieving character by ID...");
  const characterID = params.characterID || "";
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/character/${characterID}?apiKey=${marvelApiKey}`
    );
    console.log("All good");
    return response;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

module.exports.getComics = getComics;
module.exports.getComicsByCharacterID = getComicsByCharacterID;
module.exports.getComicByID = getComicByID;
module.exports.getCharacters = getCharacters;
module.exports.getCharacterByID = getCharacterByID;
