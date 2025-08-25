import Doctor from "../models/Doctor.js";
import { body, validationResult } from "express-validator";
import { generateToken } from "../middlewares/auth.js";
import Appointment from "../models/Appointment.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../config/sendEmail.js";

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

const handleCancelAppointment = async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.ACTION_SECRET);
    if (decoded.action !== "cancel") {
      return res.status(400).send("<h2>Invalid action</h2>");
    }

    const appointment = await Appointment.findById(decoded.appointmentId)
      .populate("user", "email")
      .populate("doctor", "name");

    //check for the appointments
    if (!appointment) {
      return res.status(404).send("<h2>Appointment Not Found</h2>");
    }


    //Prevent cancelling if already confirmed/cancelled
    if (appointment.status === "confirmed") {
      return res.status(400).send("<h2>❌ Appointment already confirmed. It cannot be cancelled via this link.</h2>");
    }

    if (appointment.status === "cancelled") {
      return res.status(400).send("<h2>⚠️ Appointment already cancelled.</h2>");
    }
    if(appointment.status==='pending'){
    
      appointment.status = "cancelled";

    await appointment.save();

    // Send email to user
    const emailHtml = `
      <h2>Your Appointment is Cancelled </h2>
      <p>Doctor: ${appointment.doctor.name}</p>
      <p>Date: ${appointment.slotDate}</p>
      <p>Time: ${appointment.slotTime}</p>
      <p>We are sorry for the inconvenience!</p>
    `;

    await sendEmail(appointment.user.email, "Appointment Cancelled", emailHtml);

    res.status(200).send("<h2>✅ Appointment Cancelled & User Notified</h2>");
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).send("<h2>Link Expired </h2>");
    }
    res.status(500).send("<h2>Server Error </h2>");
  }
};

const handleConfirmAppointment = async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.ACTION_SECRET);
    if (decoded.action !== "confirm") {
      return res.status(400).send("<h2>Invalid action</h2>");
    }

    const appointment = await Appointment.findById(decoded.appointmentId)
      .populate("user", "email")
      .populate("doctor", "name");

      //check for the appointment
    if (!appointment) {
      return res.status(404).send("<h2>Appointment Not Found</h2>");
    }

    // 👉 Prevent cancelling if already confirmed/cancelled
    if (appointment.status === "cancelled") {
      return res.status(400).send("<h2>❌ Appointment already cancelled. It cannot be confirmed via this link.</h2>");
    }

    if (appointment.status === "confirmed") {
      return res.status(400).send("<h2>⚠️ Appointment already confirmed.</h2>");
    }

    if(appointment.status==='pending'){
    appointment.status = "confirmed";
    await appointment.save();

    // Send email to user
    const emailHtml = `
      <h2>Your Appointment is Confirmed </h2>
      <p>Doctor: ${appointment.doctor.name}</p>
      <p>Date: ${appointment.slotDate}</p>
      <p>Time: ${appointment.slotTime}</p>
      <p>We are sorry for the inconvenience!</p>
    `;

    await sendEmail(appointment.user.email, "Appointment Confirmed", emailHtml);

    res.status(200).send("<h2> ✅ Appointment Confirmedd & User Notified </h2>");
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).send("<h2>Link Expired </h2>");
    }
    res.status(500).send("<h2>Server Error </h2>");
  }
};

handleLogin.validate = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

export {
  handleLogin,
  handleChangeAvailability,
  handleCancelAppointment,
  handleConfirmAppointment,
};