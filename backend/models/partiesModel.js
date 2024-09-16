const mongoose = require("mongoose");

const partiesSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  votes: {
    type: Number,
  },
});

const partiesModel = mongoose.model("Parties", partiesSchema);
module.exports = partiesModel;
