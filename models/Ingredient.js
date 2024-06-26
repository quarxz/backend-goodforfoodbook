const mongoose = require("mongoose");

const { Schema } = mongoose;

const ingredientSchema = new Schema(
  {
    name: { type: String, required: true },
    unit: { type: String, required: true },
    category: { type: String, required: true },
  },
  { versionKey: false }
);

const Ingredient = mongoose.models.Ingredient || mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;
