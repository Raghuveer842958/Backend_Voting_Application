const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Candidate = require("../models/candidate");
const jwt = require("jsonwebtoken");
const { jwtAuthMiddleware } = require("../jwt");

const checkIsAdmin = async (userId) => {
  const user = await User.findById(userId);
  console.log("User is ------------>:", user);
  return user.role === "admin";
};

const voteHandler = async (req, res) => {
  const candidateId = req.params.candidateId;
  const userId = req.userToken.id;
  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.send({
        response: null,
        message: "Candidate not found",
        result: false,
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.send({
        response: null,
        message: "User not found",
        result: false,
      });
    }

    // makesure user should not be admin
    if (await checkIsAdmin(userId)) {
      return res.send({
        response: user,
        message: "You are Admin You can not vote anyone",
        result: false,
      });
    }

    // makesure user can not vote more than one time
    if (user.isVoted) {
      return res.send({
        response: user,
        message: "You can Vote Only once to anyone",
        result: false,
      });
    }

    // give vote
    candidate.votes.push({ user: userId });
    candidate.voteCount++;
    const updatedCandidate = await candidate.save();

    // put user.isVoted==true
    user.isVoted = true;
    const updatedUser = await user.save();

    return res.send({
      response: { user: updatedUser, candidate: updatedCandidate },
      message: `${user.name} Your Vote Successfully Credited to ${candidate.name}`,
      result: true,
    });
  } catch (err) {
    console.log("Error in /vote/ route");
    return res.send({
      response: null,
      message: "Error in /vote/ route",
      result: false,
    });
  }
};

// remaining routes
// There should be only one Admin
// show Results(no. of votes to each party)
// show list of candidate

router.put("/vote/:candidateId", jwtAuthMiddleware, voteHandler);

module.exports = router;
