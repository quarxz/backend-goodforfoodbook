const User = require("../models/User");
const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");

const connect = require("../lib/connect");

const getRecipes = async (req, res) => {
  try {
    await connect();
    const recipes = await Recipe.find().populate("ingredients.ingredient");
    return res.status(200).json({ recipes, message: "Recipes successfully found!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "No recipes found!" });
  }
};

const getRecipe = async (req, res) => {
  try {
    await connect();
    const { id } = req.params;

    const recipe = await Recipe.findOne({ _id: id }).populate("ingredients.ingredient");
    if (!recipe) {
      return res.status(500).json({ message: "There is no Recipe with that ID!" });
    }
    return res.status(200).json({ recipe, message: "Recipe successfully found!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "No recipe found!" });
  }
};

module.exports = { getRecipes, getRecipe };
