const User = require("../models/User");
const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");

const connect = require("../lib/connect");

const getUsers = async (req, res) => {
  try {
    await connect();
    const users = await User.find().populate("recipes", "name, category");
    return res.status(200).json({ users: users, message: "User successfully found!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Users not found!" });
  }
};

const getUser = async (req, res) => {
  try {
    await connect();
    const { id } = req.params;
    const user = (await User.findOne({ _id: id }).populate("recipes stock.ingredient")) || {
      _id: null,
    };
    return res.status(200).json({ user: user, message: "User successfully found!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "User not found!" });
  }
};

const getUserId = async (req, res) => {
  try {
    await connect();
    const { email: userMail } = req.params;
    const [veryinfectedEmail] = userMail.match(
      /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
    );
    const { id, name, address, email, activeMember, colorTheme, primaryNutrationType } =
      (await User.findOne({
        email: veryinfectedEmail,
      })) || {
        _id: null,
      };
    if (!id) {
      return res.status(500).json({ id: id, message: "User not found!" });
    }
    return res.status(200).json({
      id,
      name,
      address,
      email,
      activeMember,
      colorTheme,
      primaryNutrationType,
      message: "User successfully found!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Not valid email!" });
  }
};

const addUserIngredient = async (req, res) => {
  try {
    await connect();
    const { id } = req.params;

    const user = (await User.findOne({ _id: id })) || { _id: null };
    const { _id: userId } = user;

    if (userId) {
      const { ingredientObjId, quantity } = req.body;
      if (quantity) {
        const { _id: ingredientId } = (await Ingredient.findOne({ _id: ingredientObjId })) || {
          _id: null,
        };
        if (ingredientId) {
          console.log(ingredientObjId, quantity, userId);

          // if ingredient is in List -> update
          if (user.stock.length) {
            for (let i = 0; i < user.stock.length; i++) {
              let el = user.stock[i].ingredient;

              if (el.equals(ingredientId)) {
                const updateUser = await User.findOneAndUpdate(
                  { _id: userId },
                  { $inc: { "stock.$[filter].quantity": +quantity } },
                  { arrayFilters: [{ "filter.ingredient": ingredientId }] },
                  { returnNewDocument: true }
                );

                return res.status(200).json({ message: "Ingredient is updated in stock!" });
              }
            }
          }
          // if ingredient is not in User List -> push
          const updateUser = await User.findByIdAndUpdate(
            userId,
            { $push: { stock: { ingredient: ingredientId, quantity: quantity } } },
            { returnDocument: "after" }
          );
          return res.status(200).json({ updateUser, message: "Ingredient successfully added!" });
        } else {
          return res.status(500).json({ message: "Ingredient not exits!" });
        }
      } else {
        return res.status(500).json({ message: "Quantity must be greater than 0!" });
      }
    } else {
      return res.status(500).json({ message: "User not found!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Ingredient not added!" });
  }
};

const deleteUserIngredient = async (req, res) => {
  try {
    await connect();
    const { id } = req.params;

    const user = (await User.findOne({ _id: id })) || { _id: null };
    const { _id: userId } = user;

    if (userId) {
      const { ingredientObjId, quantity } = req.body;
      if (quantity) {
        const { _id: ingredientId } = (await Ingredient.findOne({ _id: ingredientObjId })) || {
          _id: null,
        };
        if (ingredientId) {
          console.log(ingredientObjId, quantity, userId);

          user.stock.map(async (ingredient) => {
            if (ingredient.ingredient.equals(ingredientId)) {
              if (ingredient.quantity >= 1) {
                const updateUserIngredient = await User.findOneAndUpdate(
                  { _id: userId },
                  { $inc: { "stock.$[filter].quantity": -quantity } },
                  { arrayFilters: [{ "filter.ingredient": ingredientId }] },
                  { returnDocument: true }
                );

                const { stock } = await User.findOne({ _id: userId });
                stock.map(async (ingredient) => {
                  if (ingredient.ingredient.equals(ingredientId)) {
                    if (ingredient.quantity < 1 || ingredient.quantity === 0) {
                      const updateUser = await User.findByIdAndUpdate(
                        userId,
                        { $pull: { stock: { ingredient: ingredientId } } },
                        { returnNewDocument: true }
                      );
                      console.log("Delete complete", ingredientId);
                    }
                  }
                });
              }
              const updatedUser = await User.findOne({ _id: userId }).populate(
                "recipes stock.ingredient"
              );

              const { ...rest } = updatedUser._doc;
              return res.status(200).json({ ...rest, message: "Ingredient successfully deleted!" });
            }
          });
        } else {
          return res.status(500).json({ message: "Ingredient not exits!" });
        }
      } else {
        return res.status(500).json({ message: "Quantity must be greater than 0!" });
      }
    } else {
      return res.status(500).json({ message: "User not found!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Ingredient not deleted!" });
  }
};

const addRecipeToUserRecipeList = async (req, res) => {
  try {
    await connect();
    const { id } = req.params;

    const user = (await User.findOne({ _id: id })) || { _id: null };
    const { _id: userId } = user;
    if (userId) {
      /**
       * add recipe to users recipe list
       */
      const { recipeObjectId } = req.body;
      if (recipeObjectId) {
        const { _id: recipeId } = (await Recipe.findOne({ _id: recipeObjectId })) || { _id: null };
        if (recipeId) {
          // if recipe in user stock not add
          // if recipe not in user stock add
          console.log(user.recipes.length);

          if (!user.recipes.length) {
            const updateUserRecipes = await User.findByIdAndUpdate(
              userId,
              { $push: { recipes: { _id: recipeId } } },
              { returnDocument: "after" }
            );
            return res.status(200).json({
              updateUserRecipes,
              message: " Recipe successfully added to user recipes list!",
            });
          }

          if (user.recipes.length) {
            let recipesIdFromUserList = [];
            user.recipes.map(async (recipe) => {
              recipesIdFromUserList = [...recipesIdFromUserList, recipe._id.toString()];
            });

            if (recipesIdFromUserList.includes(recipeId.toString())) {
              console.log(recipesIdFromUserList);
              return res.status(500).json({ message: "Recipe is still in user recipe list!" });
            }

            const updateUserRecipes = await User.findByIdAndUpdate(
              userId,
              { $push: { recipes: { _id: recipeId } } },
              { returnDocument: "after" }
            );
            return res.status(200).json({
              updateUserRecipes,
              message: " Recipe successfully added to user recipes list!",
            });
          }
        } else {
          return res.status(500).json({ message: "Recipe not exits!" });
        }
      } else {
        return res.status(500).json({ message: "Empty ObjectId!" });
      }
    } else {
      return res.status(500).json({ message: "User not found!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Recipe was not added!" });
  }
};

const deleteRecipeToUserRecipeList = async (req, res) => {
  try {
    await connect();
    const { id } = req.params;

    const user = (await User.findOne({ _id: id })) || { _id: null };
    const { _id: userId } = user;

    if (userId) {
      const { recipeObjectId } = req.body;

      if (recipeObjectId) {
        if (!user.recipes.length) {
          return res.status(500).json({ message: "No Recipe in the user recipe list!" });
        }
        const { _id: recipeId } = (await Recipe.findOne({ _id: recipeObjectId })) || { _id: null };

        if (recipeId) {
          if (user.recipes.length) {
            let recipesIdFromUserList = [];
            user.recipes.map(async (recipe) => {
              recipesIdFromUserList = [...recipesIdFromUserList, recipe._id.toString()];
            });
            if (!recipesIdFromUserList.includes(recipeId.toString())) {
              console.log(recipesIdFromUserList);
              return res.status(500).json({ message: "Recipe is not in user recipe list!" });
            }
            user.recipes.map(async (recipe) => {
              if (recipe._id.equals(recipeId)) {
                const userUpdate = await User.findByIdAndUpdate(
                  userId,
                  { $pull: { recipes: recipeId } },
                  { returnNewDocument: true }
                );
                return res.status(200).json({ recipeId, message: "Recipe successfully deleted!" });
              }
            });
          }
        } else {
          return res.status(500).json({ message: "Recipe not exits!" });
        }
      } else {
        return res.status(500).json({ message: "Empty ObjectId!" });
      }
    } else {
      return res.status(500).json({ message: "User not found!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Recipe was not deleted!" });
  }
};

const checkRecipeIsInUserRecipeList = async (req, res) => {
  try {
    await connect();
    const { id } = req.params;
    const user = (await User.findOne({ _id: id })) || { _id: null };
    const { _id: userId } = user;
    if (userId) {
      const { recipeObjectId } = req.body;
      if (recipeObjectId) {
        if (!user.recipes.length) {
          return res.status(500).json({ message: "No Recipe in the user recipe list!" });
        }
        const { _id: recipeId } = (await Recipe.findOne({ _id: recipeObjectId })) || { _id: null };

        if (recipeId) {
          let recipesIdFromUserList = [];
          user.recipes.map(async (recipe) => {
            recipesIdFromUserList = [...recipesIdFromUserList, recipe._id.toString()];
          });
          if (!recipesIdFromUserList.includes(recipeId.toString())) {
            console.log(recipesIdFromUserList);
            return res.status(500).json({ message: "Recipe is not in user recipe list!" });
          }

          user.recipes.map(async (recipe) => {
            if (recipe._id.equals(recipeId)) {
              // const userUpdate = await User.findByIdAndUpdate(
              //   userId,
              //   { $pull: { recipes: recipeId } },
              //   { returnNewDocument: true }
              // );
              return res.status(200).json({ recipeId, message: "Recipe successfully found!" });
            }
          });
        } else {
          return res.status(500).json({ message: "Recipe not exits!" });
        }
      } else {
        return res.status(500).json({ message: "Empty ObjectId!" });
      }
    } else {
      return res.status(500).json({ message: "User not found!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Recipe not found!" });
  }
};

const getIngredientsFromUserRecipe = async (req, res) => {
  try {
    await connect();
    const { id } = req.params;

    const user = (await User.findOne({ _id: id })) || { _id: null };
    const { _id: userId } = user;

    if (userId) {
      const { recipeObjectId } = req.body;
      if (recipeObjectId) {
        const recipe = (await Recipe.findOne({ _id: recipeObjectId }).populate(
          "ingredients.ingredient"
        )) || {
          _id: null,
        };
        const { _id: recipeId } = recipe;
        if (recipeId) {
          if (!user.recipes.length) {
            return res.status(500).json({ message: "No Recipe in the user recipe List!" });
          }
          return res
            .status(200)
            .json({ ingredients: recipe.ingredients, message: "Ingredients successfully found!" });
        } else {
          return res.status(500).json({ message: "Recipe not exits!" });
        }
      } else {
        return res.status(500).json({ message: "Empty ObjectId!" });
      }
    } else {
      return res.status(500).json({ message: "User not found!" });
    }

    // return res.status(200).json({ message: "Ingredients not found!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Ingredients not found!" });
  }
};

const getIngredientsFromStock = async (req, res) => {
  try {
    await connect();
    const { id } = req.params;

    const user = (await User.findOne({ _id: id }).populate("stock.ingredient")) || { _id: null };
    const { _id: userId, stock } = user;

    if (userId) {
      return res
        .status(200)
        .json({ stock, message: "Ingredients from stock successfully loaded!" });
    } else {
      return res.status(500).json({ message: "User not found!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Ingredients not found!" });
  }
};

const addIngredientToShoppingList = async (req, res) => {
  try {
    await connect();
    const { id } = req.params;

    const user = (await User.findOne({ _id: id })) || { _id: null };
    const { _id: userId } = user;

    if (userId) {
      const { ingredientObjId, quantity } = req.body;
      if (quantity) {
        const { _id: ingredientId } = (await Ingredient.findOne({ _id: ingredientObjId })) || {
          _id: null,
        };
        if (ingredientId) {
          console.log(ingredientObjId, quantity, userId);

          // if ingredient is in List -> update
          if (user.shoppingList.length) {
            for (let i = 0; i < user.shoppingList.length; i++) {
              let el = user.shoppingList[i].ingredient;

              if (el.equals(ingredientId)) {
                const updateUser = await User.findOneAndUpdate(
                  { _id: userId },
                  { $inc: { "shoppingList.$[filter].quantity": +quantity } },
                  { arrayFilters: [{ "filter.ingredient": ingredientId }] },
                  { returnNewDocument: true }
                );

                return res.status(200).json({ message: "Ingredient is updated in shopping list!" });
              }
            }
          }
          // if ingredient is not in User List -> push
          const updateUser = await User.findByIdAndUpdate(
            userId,
            { $push: { shoppingList: { ingredient: ingredientId, quantity: quantity } } },
            { returnDocument: "after" }
          );
          return res.status(200).json({ updateUser, message: "Ingredient successfully added!" });
        } else {
          return res.status(500).json({ message: "Ingredient not exits!" });
        }
      } else {
        return res.status(500).json({ message: "Quantity must be greater than 0!" });
      }
    } else {
      return res.status(500).json({ message: "User not found!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Ingredient not added!" });
  }
};

const deleteIngredientFromShoppingList = async (req, res) => {
  try {
    await connect();
    const { id } = req.params;

    const user = (await User.findOne({ _id: id })) || { _id: null };
    const { _id: userId } = user;

    if (userId) {
      const { ingredientObjId, quantity } = req.body;
      if (quantity) {
        const { _id: ingredientId } = (await Ingredient.findOne({ _id: ingredientObjId })) || {
          _id: null,
        };
        if (ingredientId) {
          console.log(ingredientObjId, quantity, userId);

          user.shoppingList.map(async (ingredient) => {
            if (ingredient.ingredient.equals(ingredientId)) {
              if (ingredient.quantity >= 1) {
                const updateUserIngredient = await User.findOneAndUpdate(
                  { _id: userId },
                  { $inc: { "shoppingList.$[filter].quantity": -quantity } },
                  { arrayFilters: [{ "filter.ingredient": ingredientId }] },
                  { returnDocument: true }
                );

                const { shoppingList } = await User.findOne({ _id: userId });
                shoppingList.map(async (ingredient) => {
                  if (ingredient.ingredient.equals(ingredientId)) {
                    if (ingredient.quantity < 1 || ingredient.quantity === 0) {
                      const updateUser = await User.findByIdAndUpdate(
                        userId,
                        { $pull: { shoppingList: { ingredient: ingredientId } } },
                        { returnNewDocument: true }
                      );
                      console.log("Delete complete", ingredientId);
                    }
                  }
                });
              }
              const updatedUser = await User.findOne({ _id: userId }).populate(
                "recipes shoppingList.ingredient"
              );

              const { ...rest } = updatedUser._doc;
              return res.status(200).json({ ...rest, message: "Ingredient successfully deleted!" });
            }
          });
        } else {
          return res.status(500).json({ message: "Ingredient not exits!" });
        }
      } else {
        return res.status(500).json({ message: "Quantity must be greater than 0!" });
      }
    } else {
      return res.status(500).json({ message: "User not found!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Ingredient not deleted!" });
  }
};

const getIngredientsFromShoppingList = async (req, res) => {
  try {
    await connect();
    const { id } = req.params;

    const user = (await User.findOne({ _id: id }).populate("shoppingList.ingredient")) || {
      _id: null,
    };
    const { _id: userId, shoppingList } = user;

    if (userId) {
      return res
        .status(200)
        .json({ shoppingList, message: "Ingredients from shopping list successfully loaded!" });
    } else {
      return res.status(500).json({ message: "User not found!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Ingredients not found!" });
  }
};

module.exports = {
  getUsers,
  getUser,
  getUserId,
  addUserIngredient,
  deleteUserIngredient,
  addRecipeToUserRecipeList,
  deleteRecipeToUserRecipeList,
  getIngredientsFromUserRecipe,
  getIngredientsFromStock,
  checkRecipeIsInUserRecipeList,
  addIngredientToShoppingList,
  deleteIngredientFromShoppingList,
  getIngredientsFromShoppingList,
};
