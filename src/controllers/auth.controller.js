const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase().trim();

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(409).json({ message: "Account already exists, Kindly try Sign In" });
    }

    const hashed = await bcrypt.hash(password, 12);

    await User.create({
      email,
      password: hashed,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30m" },
    );

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};
