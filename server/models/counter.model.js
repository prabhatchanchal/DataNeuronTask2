const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema(
  {
    add: {
      type: Number,
    },
    update: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Counter = mongoose.model("Counter", counterSchema);

module.exports = Counter;
