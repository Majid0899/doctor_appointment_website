import Doctor from "../models/Doctor.js";
import { body, validationResult } from "express-validator";
import { generateToken } from "../middlewares/auth.js";


const handleLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Map errors into a simple array of messages
    const errorMessages = errors.array().map((err) => err.msg);
    return res.status(400).json({ success: false, errors: errorMessages });
  }
  try {
    const { email, password } = req.body;

    /**
     * Retreive a doctor from datbase
     * Compare the password
     */
    const doctor = await Doctor.findOne({ email: email }).select("+password");

    if (!doctor || !(await doctor.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, error: ["Invalid Email And Password"] });
    }
    /**Generate a token */
    const payload = {
      id: doctor._id,
      email: doctor.email,
      role: "DOCTOR",
    };

    const token = generateToken(payload);

    res
      .status(200)
      .json({ success: true, message: "Login Successfull", doctor, token });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, errors: ["Server error: " + error.message] });
  }
};

const handleChangeAvailability = async (req, res) => {
  try {
    if (req.user.role !== "DOCTOR") {
      return res
        .status(400)
        .json({
          success: false,
          error: ["Not Authorized. Please Login Again"],
        });
    }
    const docId = req.user.id;

    const doctor = await Doctor.findById(docId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, error: ["Doctor is not avaialable"] });
    }

    doctor.available = !doctor.available;
    await doctor.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Availability Changed Successfully",
        doctor,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: ["Server error" + error.message],
    });
  }
};



handleLogin.validate = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

export {
  handleLogin,
  handleChangeAvailability,
};
