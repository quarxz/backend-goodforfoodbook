const mongoose = require("mongoose");

const { Schema } = mongoose;

const typeSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { versionKey: false }
);

const Type = mongoose.models.Type || mongoose.model("Type", typeSchema);

module.exports = Type;
