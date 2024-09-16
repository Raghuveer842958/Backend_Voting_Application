const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  mobileNo: {
    type: String,
    require: true,
  },
  aadharNo: {
    type: Number,
    require: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
  },
  isVoted: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.comparePassword = async function (userPassword) {
  try {
    const isMatch = await bcrypt.compare(this.password, userPassword);
    return isMatch;
  } catch (err) {
    console.log("Error in comparing password", err);
    return err;
  }
};

userSchema.pre("save", async function (next) {
  const currUser = this;
  if (!currUser) next();
  if (!currUser.isModified("password")) next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password, salt);
    this.password = hashPassword;
    next();
  } catch (err) {
    console.log("errorn in hashing password");
    next();
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
