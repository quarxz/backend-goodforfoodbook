const Category = require("../models/Category");
const Type = require("../models/Type");
const Nutration = require("../models/Nutration");

const connect = require("../lib/connect");

const getCategories = async (req, res) => {
  try {
    await connect();
    const categories = await Category.find();
    return res.status(200).json({ categories, message: "Category successfully found!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Category not found!" });
  }
};

const getCategory = async (req, res) => {
  try {
    await connect();
    const { id } = req.params;
    const categorie = (await Category.findOne({ _id: id })) || { _id: null };
    return res.status(200).json({ categorie, message: "Category successfully found!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Category not found!" });
  }
};

const getTypes = async (req, res) => {
  try {
    await connect();
    const types = await Type.find();
    return res.status(200).json({ types, message: "Type successfully found!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Type not found!" });
  }
};

const getType = async (req, res) => {
  try {
    await connect();
    const { id } = req.params;
    const type = (await Type.findOne({ _id: id })) || { _id: null };
    return res.status(200).json({ type, message: "Type successfully found!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Type not found!" });
  }
};

const getNutrations = async (req, res) => {
  try {
    await connect();
    const nutrations = await Nutration.find();
    return res.status(200).json({ nutrations, message: "Nutrations successfully found!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Nutrations not found!" });
  }
};

const getNutration = async (req, res) => {
  try {
    await connect();
    const { id } = req.params;
    const nutration = (await Nutration.findOne({ _id: id })) || { _id: null };
    return res.status(200).json({ nutration, message: "Nutration successfully found!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Nutration not found!" });
  }
};

module.exports = { getCategories, getCategory, getTypes, getType, getNutrations, getNutration };
