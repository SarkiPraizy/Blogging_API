require("dotenv").config();
const userModel = require("../model/user");
const jwt = require("jsonwebtoken");

async function jwtToken(payload) {
    const token = await jwt.sign({ id: payload }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRATION_TIME  })
    return token
}

exports.isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const date = new Date();
    const time = parseInt(date.getTime() / 1000);
    const user = await userModel.findById(decodedToken.id);

    if (user && decodedToken.iat < time) {
      req.user = user;
      return next();
    } else {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


const signToken = (user) => {
  //this function will be called any time i need to sign users data or details
  return jwt.sign({ user }, secret, {
    expiresIn: process.env.EXPIRATION_TIME,
  });
};

// SIGNUP CONTROLLER ROUTE
exports.signup = async function (req, res, next) {
  try {
    const { email, first_name, last_name, password, confirmPassword } =
      req.body;

    console.log(req.body);

    if (password !== confirmPassword) {
      const error = new Error("password does not match");
      return next(error);
    }
    const user = await userModel.create({
      email,
      first_name,
      last_name,
      password,
      confirmPassword,
    });

    user.password = undefined;
    user.confirmPassword = undefined;
    const token = await jwtToken(user._id);
    return res.json({
      message: "Signup successfull",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// SIGIN CONTROLLER ROUTE

exports.signin = async function (req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Username or password is incorrect");
      return next(error);
    }
    // check if user exist && password is correct

    const user = await userModel.findOne({ email });
    if (!user || !(await user.comparePassword(password, user.password))) {
      console.log(typeof password, typeof user.password)
      const error = new Error("Incorrect email or password");
      return next(error);
    }

    // if all conditions are passed then send token
    user.password = undefined;
    const token = await jwtToken(user._id);
    res.status(200).json({
      status: "success",
      token,
      user,
    });
  } catch (error) {
    return next(error, { message: "user login unsuccessful" });
  }
};
