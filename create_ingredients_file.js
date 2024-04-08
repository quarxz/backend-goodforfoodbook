const fs = require("fs");

/**
 * create ingredients from recipe.json file
 */
fs.readFile("./data/import/recipes.json", "utf8", (error, data) => {
  if (error) {
    console.log(error);
    return;
  }
  // console.log(JSON.parse(data));
  const recipes = JSON.parse(data);

  let allIngredients = [];
  let allIngredientsObj = [];
  let allUnits = [];
  let allUnitsObj = [];

  const createIngredientsfromRecipes = () => {
    if (recipes) {
      console.log(recipes);
      recipes.map((recipe) => {
        recipe.ingredients.map((ingredient) => {
          // console.log(ingredient.name);
          if (!allIngredients.includes(ingredient.name)) {
            allIngredients = [...allIngredients, ingredient.name];
            allIngredientsObj = [
              ...allIngredientsObj,
              { name: ingredient.name, unit: ingredient.unit },
            ];
          }
          if (!allUnits.includes(ingredient.unit)) {
            allUnits = [...allUnits, ingredient.unit];
            allUnitsObj = [...allUnitsObj, { name: ingredient.unit }];
          }
        });
      });
    }
  };
  createIngredientsfromRecipes();
  console.log(allIngredientsObj);

  fs.writeFile(
    "./data/import/ingredients.json",
    JSON.stringify(allIngredientsObj, null, 2),
    "utf8",
    function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file ingredients.json was saved!");
    }
  );
  fs.writeFile(
    "./data/import/units.json",
    JSON.stringify(allUnitsObj, null, 2),
    "utf8",
    function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file units.json was saved!");
    }
  );
});
