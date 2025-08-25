import User from "../models/User.js";
import { generateToken, generateActionToken } from "../middlewares/auth.js";
import { body, validationResult } from "express-validator";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import { sendEmail } from "../config/sendEmail.js";

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

const handleUpdateProfile = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Map errors into a simple array of messages
    const errorMessages = errors.array().map((err) => err.msg);
    return res.status(400).json({ success: false, errors: errorMessages });
  }
  try {
    const userId = req.user.id; // from jwtAuthMiddleware
    /**Taking userInput */
    const { name, email, phone, password, address, gender, dateOfBirth } =
      req.body;

      //adding the field in updatefields which has come from request
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (password) updateFields.password = password;
    if (phone) updateFields.phone = phone;
    if (address) updateFields.address = address;
    if (gender) updateFields.gender = gender;
    if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;

    //check for the image 
    if (req.file) {
      updateFields.image = `/uploads/${req.file.filename}`;
    }


    //update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("+password");

    res.status(201).json({
      success: true,
      user: updatedUser,
      message: "User Updated Successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, errors: ["Server error: " + error.message] });
  }
};

const handleBookAppointment = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Map errors into a simple array of messages
    const errorMessages = errors.array().map((err) => err.msg);
    return res.status(400).json({ success: false, errors: errorMessages });
  }

  try {
    const userId = req.user.id;
    const doctorId = req.params.doctorId;
    const { slotDate, slotTime } = req.body;

    //  update doctor slots
    const doctor = await Doctor.findOneAndUpdate(
      {
        _id: doctorId,
        available: true,
        // ensure slot is not already booked
        $or: [
          { [`slots_booked.${slotDate}`]: { $ne: slotTime } },
          { [`slots_booked.${slotDate}`]: { $exists: false } },
        ],
      },
      {
        $push: { [`slots_booked.${slotDate}`]: slotTime },
      },
      { new: true }
    );

    //Check for the slot is booked or doctor is available or not
    if (!doctor) {
      return res.status(409).json({
        success: false,
        error: ["Slot not available or doctor not available"],
      });
    }

    // Create appointment
    const appointment = new Appointment({
      user: userId,
      doctor: doctorId,
      slotDate,
      slotTime,
      amount: doctor.fees,
    });

    //save appointment
    await appointment.save();

    //create confirm and cancel token for doctor
    const confirmToken = generateActionToken(appointment._id, "confirm");
    const cancelToken = generateActionToken(appointment._id, "cancel");

    const confirmUrl = `${process.env.BACKEND_URL}/doctor/confirm-appointment/${confirmToken}`;
    const rejectUrl = `${process.env.BACKEND_URL}/doctor/cancel-appointment/${cancelToken}`;

    //Notify Doctor
    const emailHtml = `
      <h2>New Appointment Request</h2>
      <p>Dear Dr. ${doctor.name},</p>
      <p>You have a new appointment request from <b>${req.user.username}</b>.</p>
      <p><b>Date:</b> ${slotDate}</p>
      <p><b>Time:</b> ${slotTime}</p>
      <p><b>Fees:</b> ${doctor.fees}</p>
      <p>Please take an action:</p>
      <a href="${confirmUrl}" style="padding:10px 15px; background:green; color:white; text-decoration:none; border-radius:5px;">Confirm</a>
      &nbsp;
      <a href="${rejectUrl}" style="padding:10px 15px; background:red; color:white; text-decoration:none; border-radius:5px;">Reject</a>
    `;

    //send email
    await sendEmail(doctor.email, "New Appointment Request", emailHtml);

    res.status(201).json({
      success: true,
      message: "Appointment has been booked",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: ["Server error: " + error.message],
    });
  }
};

const handleListAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await Appointment.find({ user: userId })
      .populate("user", "name email phone genderdateOfBirth")
      .populate("doctor", "name email speciality ");
    
    //check for the appointment specific to user
    if (appointments.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: ["No Appoinments"] });
    }
    res.status(200).json({
      success: true,
      message: "Appoinments Fetched Successfully",
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: ["Server error" + error.message],
    });
  }
};

const handleCancelAndDeleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;

    const appointment = await Appointment.findById(appointmentId).
    populate("user", "username email phone gender dateOfBirth")
    .populate("doctor", "name email fees ");

    //check for the appointment
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, error: ["No Appointment available"] });
    }

    
    // Ensure only the user who booked can cancel
    if(appointment.user._id.toString() !==req.user.id.toString()){
      return res
        .status(403)
        .json({ success: false, error: ["Not authorized to cancel this appointment"] });
    }
    
    appointment.status = "cancelled";

    //save the appointment
    await appointment.save();

    // Free doctor's slot
    await Doctor.findByIdAndUpdate(
      appointment.doctor._id,
      {
        $pull: { [`slots_booked.${appointment.slotDate}`]: appointment.slotTime },
      }
    );

    //Notify Doctor
    const emailHtml = `
      <h2>Appointment Cancelled</h2>
      <p>Dear Dr. ${appointment.doctor.name},</p>
      <p>The appointment scheduled with <b>${req.user.username}</b> has been cancelled.</p>
      <p><b>Date:</b> ${appointment.slotDate}</p>
      <p><b>Time:</b> ${appointment.slotTime}</p>
      <p><b>Fees:</b> ${appointment.doctor.fees}</p>
      <p>No further action is required.</p>
    `;

    await sendEmail(appointment.doctor.email,"Appointment Cancelled", emailHtml)

    // Delete appointment
    await Appointment.findByIdAndDelete(appointmentId);
    res
      .status(200)
      .json({ success: true, message: "Appointment Cancelled", appointment });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: ["Server error" + error.message] });
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

handleUpdateProfile.validate = [
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please provide a valid phone number"),
  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),
  body("dateOfBirth")
    .optional()
    .matches(/^\d{2}-\d{2}-\d{4}$/)
    .withMessage("Date of Birth must be in format DD-MM-YYYY"),
  body("address.street")
    .optional()
    .notEmpty()
    .withMessage("Street is required"),
  body("address.city").optional().notEmpty().withMessage("City is required"),
  body("address.state").optional().notEmpty().withMessage("State is required"),
  body("address.postalCode")
    .optional()
    .notEmpty()
    .withMessage("Postal code is required"),
  body("address.country")
    .optional()
    .notEmpty()
    .withMessage("Country is required"),
];

handleBookAppointment.validate = [
  body("slotDate")
    .notEmpty()
    .withMessage("Slot date is required")
    .matches(/^\d{2}-\d{2}-\d{4}$/)
    .withMessage("Date must be in DD-MM-YYYY format"),

  body("slotTime")
  .notEmpty()
  .withMessage("Slot time is required")
  .matches(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i)
  .withMessage("Time must be in hh:mm AM/PM format"),

];

export {
  handleRegisterUser,
  handleLoginUser,
  handleGetProfile,
  handleUpdateProfile,
  handleBookAppointment,
  handleCancelAndDeleteAppointment,
  handleListAppointments,
};

