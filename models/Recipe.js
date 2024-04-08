const mongoose = require("mongoose");

const Ingredient = require("./Ingredient");

const { Schema } = mongoose;

const recipeSchema = new Schema(
  {
    category: { type: String, required: false },
    name: { type: String, required: false },
    recipeType: { type: String, required: false },
    nutrationType: { type: String, required: false },
    ingredients: [
      {
        ingredient: { type: Schema.Types.ObjectId, ref: "Ingredient" },
        quantity: { type: Number, required: false },
      },
      { _id: false },
    ],
    preparing: { type: String, required: false },
    rating: { type: Number, required: false },
  },
  { versionKey: false }
);

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
