const User = require("../model/user");

exports.getAllUsers = async function (req, res, next) {
  try {
    const Users = await User.find();
    return res
      .status(200)
      .json({ message: "success", result: Users.length, Users });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async function (req, res, next) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: false, order: null });
    }

    return res.json({ status: true, user });
  } catch (error) {
    return res.status(404).json({ message: "can't get user by id", error });
  }
};

exports.updateUser = async function (req, res, next) {
  try {
    const { userId } = req.params;
    const userDetails = req.body;

    const user = await User.findById(userId, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ status: false, order: null });
    }
    await User.findByIdAndUpdate(user, userDetails, {
      runValidators: true, // Runs validations for the updated fields
    });

    return res.json({ status: true });
  } catch (error) {
    res.status(404).json({ message: "user update unsuccessful", error });
  }
};

exports.deleteUser = async function (req, res, next) {
  try {
    const { userId } = req.params;

    const user = await User.deleteOne({ _id: userId });

    return res.json({ status: true, user });
  } catch (error) {
    res.status(401).json({ message: "user deletion failed", error });
  }
};
