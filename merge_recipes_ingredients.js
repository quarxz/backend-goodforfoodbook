const fs = require("fs");

const ingredients = JSON.parse(
  fs.readFileSync("./data/export/good-for-foodbook.ingredients.json", "utf8")
);
let allIngredients = [];
if (ingredients) {
  ingredients.map((ingredient) => {
    allIngredients = [...allIngredients, ingredient];
  });
}
// console.log(allIngredients);

const recipes = JSON.parse(
  fs.readFileSync("./data/export/good-for-foodbook.recipes_test.json", "utf8")
);
let allIngredients_from_recipies = [];
if (recipes) {
  // console.log(recipes);
  recipes.map((recipe) => {
    recipe.ingredients.map((ingredient) => {
      allIngredients_from_recipies = [...allIngredients_from_recipies, ingredient];
    });
  });
}
// console.log(allIngredients_from_recipies);

const mergeIngredients = (arr1, arr2) => {
  return arr1.map((x) => {
    // return x.name;
    const y = arr2.find((val) => val.name === x.name);
    if (!y) return x;
    return { ...x, ...y };
  });
};
// const result = mergeIngredients(allIngredients, allIngredients_from_recipies);
// console.log(result);
// console.log(mergeIngredients(allIngredients, allIngredients_from_recipies));

const mergeIngredientsx = (arr1, arr2) => {
  return arr1.map((recipe) => {
    return (recipe = [
      {
        ...recipe,
        ingredients: arr1.map((x) => {
          return x.ingredients.map((ingredient) => {
            // return ingredient;
            const y = arr2.find((val) => val.name === ingredient.name);
            return y;
          });
        }),
      },
    ]);
  });
};
const result = mergeIngredientsx(recipes, ingredients);
console.log(result);

fs.writeFile("./data/test.json", JSON.stringify(result, null, 2), "utf8", function (err) {
  if (err) {
    return console.log(err);
  }
  console.log("The file ingredients.json was saved!");
});

// ##############
// fs.readFile("./data/export/good-for-foodbook.ingredients.json", "utf8", (error, data) => {
//   if (error) {
//     console.log(error);
//     return;
//   }
//   const ingredients = JSON.parse(data);
//   processFile(ingredients);
// });

// const processFile = async (ingredients) => {
//   let allIngredients = [];
//   if (ingredients) {
//     ingredients.map((ingredient) => {
//       //   console.log(ingredient.name);
//       allIngredients = [...allIngredients, ingredient];
//     });
//   }
//   //   console.log(ingredients);
//   //   console.log(allIngredients);
// };
