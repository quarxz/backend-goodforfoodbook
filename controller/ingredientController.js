const Ingredient = require("../models/Ingredient");

const connect = require("../lib/connect");

const getIngredients = async (req, res) => {
  try {
    await connect();
    const ingredients = await Ingredient.find();
    return res.status(200).json({ ingredients, message: "Ingredients successfully found!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Ingredients not found!" });
  }
};

const getIngredient = async (req, res) => {
  try {
    await connect();
    const { id } = req.params;
    const ingredient = (await Ingredient.findOne({ _id: id })) || { _id: null };
    return res.status(200).json({ ingredient, message: "Ingredient successfully found!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Ingredient not found!" });
  }
};

module.exports = { getIngredients, getIngredient };
