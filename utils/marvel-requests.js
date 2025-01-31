const dotenv = require("dotenv");
dotenv.config();
const marvelApiKey = process.env.MARVEL_API_KEY;

const axios = require("axios");

// Get comics
async function getComics(title, limit, skip) {
  if (!limit || !Number(limit) || limit < 1 || limit > 100) {
    limit = 100;
  }
  try {
    let response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/?title=${
        title || ""
      }&limit=${limit}&skip=${skip || ""}&apiKey=${marvelApiKey}`
    );
    return response;
  } catch (error) {
    return error;
  }
}

// Get comic by Comic ID
async function getComicByID(comicID) {
  try {
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comic/${
        comicID || ""
      }?apiKey=${marvelApiKey}`
    );
    return response;
  } catch (error) {
    return error;
  }
}

// Get comics by Character ID
async function getComicsByCharacterID(characterID) {
  try {
    let response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${
        characterID || ""
      }?apiKey=${marvelApiKey}`
    );
    return response;
  } catch (error) {
    return error;
  }
}

// Get characters
async function getCharacters(name, limit, skip) {
  if (!limit || !Number(limit) || limit < 1 || limit > 100) {
    limit = 100;
  }
  try {
    let response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?&name=${
        name || ""
      }&limit=${limit}&skip=${skip || ""}&apiKey=${marvelApiKey}`
    );
    return response;
  } catch (error) {
    return error;
  }
}

// Get character by ID
async function getCharacterByID(characterID) {
  try {
    let response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/character/${
        characterID || ""
      }?apiKey=${marvelApiKey}`
    );
    return response;
  } catch (error) {
    return error;
  }
}

module.exports.getComics = getComics;
module.exports.getComicsByCharacterID = getComicsByCharacterID;
module.exports.getComicByID = getComicByID;
module.exports.getCharacters = getCharacters;
module.exports.getCharacterByID = getCharacterByID;
