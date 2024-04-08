const mongoose = require("mongoose");
const Ingredient = require("./models/Ingredient.js");
const Recipe = require("./models/Recipe.js");
const recipesInput = require("./data/recipes-in.json");

async function main() {
  const uri = "mongodb://localhost:27017/recipes";
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  await mongoose.connect(uri, options);
  await Recipe.deleteMany({});
  await Ingredient.deleteMany({});
  for (const recipeInput of recipesInput) {
    const ingredients = [];
    for (const ingredientInput of recipeInput.ingredients) {
      const ingredient = await Ingredient.findOne({
        name: ingredientInput.name,
      });
      if (ingredient) {
        ingredients.push(ingredient);
      } else {
        const newIngredient = new Ingredient({
          name: ingredientInput.name,
          amount: ingredientInput.amount,
        });
        await newIngredient.save();
        ingredients.push(newIngredient);
      }
    }

    const recipe = new Recipe({
      name: recipeInput.name,
      ingredients,
    });
    await recipe.save();
  }
  await mongoose.disconnect();
}

main()
  .then(() => {
    console.log("Import finished");
  })
  .catch((err) => {
    console.error(err);
  });
