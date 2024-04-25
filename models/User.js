const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: false },
    password: { type: String, required: false },
    name: {
      firstname: { type: String, required: false },
      lastname: { type: String, required: false },
    },
    address: {
      street: { type: String, required: false },
      number: { type: Number, required: false },
      postcode: { type: String, required: false },
      city: { type: String, required: false },
    },

    activeMember: { type: Boolean, required: false },
    colorTheme: { type: String, required: false },
    primaryNutrationType: { type: String, required: false },

    recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
    stock: [
      {
        ingredient: { type: Schema.Types.ObjectId, ref: "Ingredient" },
        quantity: { type: Number, required: false },
      },
    ],
    shoppingList: [
      {
        ingredient: { type: Schema.Types.ObjectId, ref: "Ingredient" },
        quantity: { type: Number, required: false },
      },
    ],
  },
  { versionKey: false }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
