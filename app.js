require("dotenv").config();
const express = require("express");

const app = express();
const cors = require("cors");

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

const connect = require("./lib/connect");

const {
  getUsers,
  getUser,
  getUserId,
  addUserIngredient,
  deleteUserIngredient,
  addRecipeToUserRecipeList,
  getIngredientsFromRecipe,
  getIngredientsFromStock,
  deleteRecipeToUserRecipeList,
} = require("./controller/userController");
const { getRecipes, getRecipe } = require("./controller/recipeController");
const {
  getCategories,
  getCategory,
  getTypes,
  getType,
  getNutrations,
  getNutration,
} = require("./controller/filterController");
const { getIngredients, getIngredient } = require("./controller/ingredientController");

const server = app.listen(port, () => console.log(`Express app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const time = new Date(Date.now()).toLocaleTimeString("de-DE");
const hour = Number(time.substring(0, 2));
const greeting = hour <= 9 ? "Good Morning" : hour >= 18 ? "Good evening" : "Hello";

app.get("/", async (req, res) => {
  await connect();
  return res.status(200).json({ message: `${greeting}, form backend Good-for-FoodBook !` });
});

// Users
app.get("/users", getUsers);
// ToDo: delete >>get<< User in final Version
// User
app.get("/users/:id", getUser);
app.post("/users/:id", getUser);
// User - Login
app.post("/users/:email/login", getUserId);
// User - Stock
app.post("/users/:id/addIngredient", addUserIngredient);
app.post("/users/:id/deleteIngredient", deleteUserIngredient);
// User - add/delete recipe user recipe list
app.post("/users/:id/addRecipeToUserRecipeList", addRecipeToUserRecipeList);
app.post("/users/:id/deleteRecipeToUserRecipeList", deleteRecipeToUserRecipeList);
// User - Match
app.get("/users/:id/getIngredientsFromRecipe", getIngredientsFromRecipe);
app.get("/users/:id/getIngredientsFromStock", getIngredientsFromStock);
/**
 * matched ingredients with recipe
 * add matched ingredients to shopping list and update shoppinglist
 */
// app.get("/users/:id/matchedIngredients", matchedUserRecipeIngredients);

// Recipes
app.get("/recipes", getRecipes);
app.get("/recipes/:id", getRecipe);

//Filter
app.get("/categories", getCategories);
app.get("/categories/:id", getCategory);
app.get("/types", getTypes);
app.get("/types/:id", getType);
app.get("/nutrations", getNutrations);
app.get("/nutrations/:id", getNutration);

// Ingredients
app.get("/ingredients", getIngredients);
app.get("/ingredients/:id", getIngredient);
