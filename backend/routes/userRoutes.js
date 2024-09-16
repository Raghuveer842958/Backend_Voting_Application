const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const partiesModel = require("../models/partiesModel");
const { jwtAuthMiddleware } = require("../jwt");

const registerHandler = async (req, res) => {
  try {
    const { name, password, aadharNo, age, ...rest } = req.body;
    if (!name || !aadharNo || !password || !age) {
      return res.send({
        response: null,
        message: "Please Fill all data Carefully",
        result: false,
      });
    }
    const user = await User.findOne({ aadharNo: aadharNo });
    if (user) {
      return res.send({
        response: user,
        message: "User Allready Registered",
        result: false,
      });
    }
    const newUser = new User({ name, password, aadharNo, ...rest });
    const createdUser = await newUser.save();
    return res.send({
      response: createdUser,
      result: true,
      message: "User Successfully Registered",
    });
  } catch (err) {
    res.send({
      error: err,
      message: "Error in user Registration",
      result: false,
    });
  }
};

const loginHandler = async (req, res) => {
  // try {
  //   const { aadharNo, userPassword } = req.body;
  //   const user = await User.findOne({ aadharNo: aadharNo });
  //   if (!user) {
  //     return res.send({
  //       response: null,
  //       message: "Invalid User email id ",
  //       result: false,
  //     });
  //   }
  //   if (!user.comparePassword(userPassword)) {
  //     return res.send({
  //       response: null,
  //       message: "Invalid User Password ",
  //       result: false,
  //     });
  //   }
  //   const payload = {
  //     id: user.id,
  //   };
  //   // const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
  //   const token = jwt.sign(payload, "Raghu", { expiresIn: 30000 });
  //   // return res.json({ token });
  //   res.cookie("token", token);
  //   return res.send({
  //     response: user,
  //     message: "You are successfully Logined",
  //     result: true,
  //   });
  // } catch (err) {
  //   console.log("error is :", err);
  //   return res.send({
  //     error: err,
  //     message: "Error in Login Route........",
  //     result: false,
  //   });
  // }

  try {
    const { aadharNo, userPassword } = req.body;
    const user = await User.findOne({ aadharNo });
    if (!user) {
      return res.status(401).send({
        response: null,
        message: "Invalid User email ID",
        result: false,
      });
    }
    if (!user.comparePassword(userPassword)) {
      return res.status(401).send({
        response: null,
        message: "Invalid User Password",
        result: false,
      });
    }

    const payload = {
      id: user.id,
    };
    const token = jwt.sign(payload, "Raghu", { expiresIn: "1h" }); // Adjust the expiry time as needed

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true, // Uncomment when deploying to production with HTTPS
      sameSite: "Lax",
      maxAge: 3600000, // 1 hour
    });

    return res.send({
      response: user,
      message: "You are successfully logged in",
      result: true,
    });
  } catch (err) {
    console.log("Error in login route:", err);
    return res.status(500).send({
      error: err,
      message: "Error in Login Route",
      result: false,
    });
  }
};

const profileHandler = async (req, res) => {
  try {
    const userData = req.userToken;
    console.log("user data is :", userData);

    const id = userData.id;
    const user = await User.findById(id);
    if (!user) {
      console.log("user not found ");
      res.send({ message: "user not found" });
    }
    console.log("user find :", user);
    res.send({ response: user, message: "This is your profile" });
  } catch (err) {
    console.log("error in /profile router :", err);
    return res.send({
      response: err,
      message: "error in /profile router",
      result: false,
    });
  }
};

const updateProfileHandler = async (req, res) => {
  const userData = req.userToken;
  console.log("User Data is :", userData);
  try {
    const userId = userData.id;
    const user = await User.findById(userId);
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

const resultHandler = async (req, res) => {
  try {
    const partiesData = await partiesModel.find();
    console.log("User Token is :", token);
    return res.send({
      response: partiesData,
      message: "parties data fetch successfully",
      result: true,
    });
  } catch (err) {
    return res.send({
      error: err,
      message: "Error in Fetching Parties data",
      result: false,
    });
  }
};

const createParties = async (req, res) => {
  try {
    const { partiesName, voteCount } = req.body;
    if (!partiesName) {
      return res.send({
        response: null,
        message: "Please Enter the parties Name",
        result: false,
      });
    }
    const data = new partiesModel({ name: partiesName, votes: voteCount });
    const temp = await data.save();
    return res.send({
      response: temp,
      message: "party Successfully build",
      result: true,
    });
  } catch (err) {
    return res.send({
      error: err,
      message: "Error in Fetching Parties data",
      result: false,
    });
  }
};

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/profile", jwtAuthMiddleware, profileHandler);
router.put("/profile/updatePassword", jwtAuthMiddleware, updateProfileHandler);
router.get("/result", resultHandler);
router.post("/createParties", createParties);

module.exports = router;

// {
//   "name": "Raghuveer",
//   "age": 22,
//   "mobileNo": "7787",
//   "email": "raghuveer123@gmail.com",
//   "address": "kamata kaima maharajgung uttar pradesh india",
//   "password": "Raghuveer123",
//   "aadharNo":984812783872
// }
