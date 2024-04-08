const mongoose = require("mongoose");

const { Schema } = mongoose;

const nutrationSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { versionKey: false }
);

const Nutration = mongoose.models.Nutration || mongoose.model("Nutration", nutrationSchema);

module.exports = Nutration;
