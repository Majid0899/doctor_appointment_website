import User from "../models/User.js";
import { generateToken} from "../middlewares/auth.js";
import { body, validationResult } from "express-validator";

const handleRegisterUser = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Map errors into a simple array of messages
    const errorMessages = errors.array().map((err) => err.msg);
    return res.status(400).json({ success: false, errors: errorMessages });
  }
  try {
    //extract the fields
    const { name, email, password, phone, address, gender, dateOfBirth } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, errors: ["User already exists"] });
    }

    //create a new user
    const user = new User({
      name,
      email,
      password,
      phone,
      address,
      gender,
      dateOfBirth,
    });

    //saves the user in database
    await user.save();

    /**Generate a token */
    const payload = {
      id: user._id,
      username: user.name,
      useremail: user.email,
    };

    const token = generateToken(payload);

    res.status(201).json({
      success: true,
      user,
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, errors: ["Server error: " + error.message] });
  }
};

const handleLoginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Map errors into a simple array of messages
    const errorMessages = errors.array().map((err) => err.msg);
    return res.status(400).json({ success: false, errors: errorMessages });
  }
  try {
    const { email, password } = req.body;

    /**
     * Retreive a user from datbase
     * Compare the password
     */
    const user = await User.findOne({ email: email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, error: ["Invalid Email and password"] });
    }
    /**Generate a token */
    const payload = {
      id: user._id,
      username: user.name,
      useremail: user.email,
    };

    const token = generateToken(payload);

    res
      .status(200)
      .json({ success: true, user, message: "Login Successfull", token });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, errors: ["Server error: " + error.message] });
  }
};

const handleGetProfile = async (req, res) => {
  try {
    const userId = req.user.id; //from jwtAuthmiddleware
    const user = await User.findById(userId).select("+password");
    
    //check for the user is not present or not
    if (!user) {
      return res
        .status(404)
        .json({ success: false, errors: ["User not found"] });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, errors: ["Server error: " + error.message] });
  }
};



handleRegisterUser.validate = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

handleLoginUser.validate = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];



export {
  handleRegisterUser,
  handleLoginUser,
  handleGetProfile,
};
