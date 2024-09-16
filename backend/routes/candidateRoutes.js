const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { jwtAuthMiddleware } = require("../jwt");

const checkIsAdmin = async (userId) => {
  const user = await User.findById(userId);
  console.log("User is ------------>:", user);
  return user.role === "admin";
};

const candidateHandler = async (req, res) => {
  const id = req.userToken.id;
  console.log("UserId is :", id);
  try {
    if (!checkIsAdmin(id)) {
      return res.send({
        response: null,
        message: "You are not admin,can not access this route",
        result: false,
      });
    }
    const { name, age, party, ...rest } = req.body;
    if (!name || !age || !party) {
      return res.send({
        response: null,
        message: "Please Enter all Credintial",
        result: true,
      });
    }
    const check = await Candidate.findOne({ party: party });
    if (check) {
      res.send({
        response: check,
        message: "This party name is allready taken",
        result: false,
      });
    }
    const newCandidate = await new Candidate({ name, age, party, ...rest });
    const temp = await newCandidate.save();
    return res.send({
      response: temp,
      message: "Your Party is Created",
      result: true,
    });
  } catch (err) {
    console.log("Error in /candidate Route", err);
    return res.send({
      response: err,
      message: "Error in /candidate route",
      result: false,
    });
  }
};

const updateProfileHandler = async (req, res) => {
  const id = req.userToken.id;
  try {
    if (!checkIsAdmin(id)) {
      return res.send({
        response: null,
        message: "First Register then you can update Profile",
        result: false,
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.send({
        response: null,
        message: "First Register then You can Update password",
        result: false,
      });
    }
    const { newPassword } = req.body;
    user.password = newPassword;
    const updatedUser = await user.save();
    return res.send({
      resopnse: updatedUser,
      message: "Your password Updated Successfully",
      result: true,
    });
  } catch (err) {
    console.log("error in /profile/passwordUpdate route");
    console.log("error is :", err);
    return res.send({
      response: err,
      message: "error in /profile router",
      result: false,
    });
  }
};

router.post("/candidate", jwtAuthMiddleware, candidateHandler);
router.put(
  "/candidate/updatePassword",
  jwtAuthMiddleware,
  updateProfileHandler
);
router.delete("/candidate/delete");

module.exports = router;
