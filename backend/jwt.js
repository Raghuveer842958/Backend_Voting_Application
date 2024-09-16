const jwt = require("jsonwebtoken");

// const jwtAuthMiddleware = async (req, res, next) => {
//   // extract jwt token
//   const auth = req.headers.authorization;
//   if (!auth) {
//     console.log("Token not found in jwtMiddleware");
//     return res.send({ error: "Invalid Token" });
//   }
//   const token = req.headers.authorization.split(" ")[1];
//   if (!token) {
//     console.log("token not found");
//     res.send("token not found");
//   }

//   // verify jwt token
//   try {
//     const decodedMs = jwt.verify(token, "Raghu");
//     req.userToken = decodedMs;
//     next();
//   } catch (err) {
//     console.log("errorn in jwtmiddleware :", err);
//     res.send(err);
//   }
// };

const jwtAuthMiddleware = async (req, res, next) => {
  // Extract token from cookies
  const token = req.cookies.token;
  if (!token) {
    console.log("Token not found in jwtMiddleware");
    return res.status(401).send({ error: "Invalid Token" });
  }

  // Verify JWT token
  try {
    const decodedMs = jwt.verify(token, "Raghu");
    req.userToken = decodedMs;
    next();
  } catch (err) {
    console.log("Error in jwtMiddleware:", err);
    return res.status(401).send({ error: "Token verification failed" });
  }
};

const generateToken = (userData) => {
  return jwt.sign(userData, "Raghu", { expiresIn: 30000 });
};

module.exports = { jwtAuthMiddleware, generateToken };
