const passport = require("passport");
const express = require("express");
const userController = require("../controller/userController");

const userRouter = express.Router();

userRouter.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  userController.getUserById
);
userRouter.get("/", userController.getAllUsers);

userRouter.patch(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  userController.updateUser
);

userRouter.delete(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  userController.deleteUser
);

module.exports = userRouter;
