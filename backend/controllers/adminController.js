import { generateToken } from "../middlewares/auth.js";
import { body, validationResult } from "express-validator";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import dotenv from "dotenv";
import { sendEmail } from "../config/sendEmail.js";

dotenv.config();

const handleAdminLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Map errors into a simple array of messages
    const errorMessages = errors.array().map((err) => err.msg);
    return res.status(400).json({ success: false, errors: errorMessages });
  }
  try {
    const { email, password } = req.body;

    //verify the admin email and password
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res
        .status(400)
        .json({ success: false, error: ["Invalid Email And Password"] });
    }

    /**Generate a token */
    const payload = {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "ADMIN",
    };

    const token = generateToken(payload);
    res.status(200).json({ success: true, token });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: ["Server error: " + error.message] });
  }
};

const handleAddDoctor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Map errors into a simple array of messages
    const errorMessages = errors.array().map((err) => err.msg);
    return res.status(400).json({ success: false, errors: errorMessages });
  }
  try {
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ success: false, error: ["Not Authorized Login Again"] });
    }
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    //check for the image
    let image;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    /** Check for Doctor */
    const existingDoctor = await Doctor.findOne({ email: email });
    if (existingDoctor) {
      return res
        .status(400)
        .json({ success: false, error: ["Doctor Already Exist"] });
    }

    //create  a doctor
    const doctor = new Doctor({
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      ...(image && { image }),
    });

    //add a doctor
    await doctor.save();

    res
      .status(201)
      .json({ success: true, message: "Doctor Added Successfully", doctor });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: ["Server error" + error.message] });
  }
};

const handleAllDoctors = async (req, res) => {
  try {
    //Authorize the admin
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ success: false, error: ["Not Authorized. Pleae Login Again"] });
    }
    //if the data is large
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [doctors, totalDoctors] = await Promise.all([
      Doctor.find({}).select("-password").skip(skip).limit(limit),
      Doctor.countDocuments(),
    ]);

    //check for the doctor
    if (doctors.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: ["No Doctors are available"] });
    }

    res.status(200).json({
      success: true,
      message: "Doctors fetched successfully",
      doctors: doctors,
      pagination: {
        total: totalDoctors,
        page,
        limit,
        totalPages: Math.ceil(totalDoctors / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: ["Server error" + error.message],
    });
  }
};

const handleAllAppointments = async (req, res) => {
  try {
    //Authorize the admin
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ success: false, error: ["Not Authorized. Pleae Login Again"] });
    }
    //for large data
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [appointments, totalAppointments] = await Promise.all([
      Appointment.find({}).skip(skip).limit(limit),
      Appointment.countDocuments(),
    ]);

    if (appointments.length === 0) {
      return res
        .status(400)
        .json({ success: true, message: ["No Appointments are available"] });
    }

    res.status(200).json({
      success: true,
      message: "Appointment fetched successfully",
      appointments: appointments,
      pagination: {
        total: totalAppointments,
        page,
        limit,
        totalPages: Math.ceil(totalAppointments / limit),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: ["Server error" + error.message],
    });
  }
};

const handleDashBoard = async (req, res) => {
  try {
    //Authorize admin only
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ success: false, error: ["Not Authorized. Pleae Login Again"] });
    }

    // Get counts of doctor and patient
    const doctorCount = await Doctor.countDocuments();
    const patientCount = await User.countDocuments();

    // Fetch latest 5 appointments only
    const latestAppointments = await Appointment.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("doctor", "name speciality")
      .populate("user", "name email");

    //create the output structure
    const dashData = {
      totalDoctors: doctorCount,
      totalPatients: patientCount,
      latestAppointments,
    };

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      dashData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: [
        "Something went wrong while fetching dashboard data" + error.message,
      ],
    });
  }
};

const handleCancelAndDeleteAppointment = async (req, res) => {
  try {
    //Auhtorize  admin only
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ success: false, error: ["Not Authorized. Pleae Login Again"] });
    }
    const appointmentId = req.params.appointmentId;

    const appointment = await Appointment.findById(appointmentId)
      .populate("doctor", "name email")
      .populate("user", "name email");

    //check for the appointment
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, error: ["No Appointment available"] });
    }

    appointment.status = "cancelled";

    await appointment.save();

    // Free doctor's slot
    await Doctor.findByIdAndUpdate(appointment.doctor._id, {
      $pull: { [`slots_booked.${appointment.slotDate}`]: appointment.slotTime },
    });

    //Notify user
    const emailHtml = `
      <h2>Appointment Cancelled</h2>
      <p>Dear ${appointment.user.name},</p>
      <p>The appointment scheduled with <b>Dr. ${appointment.doctor.name}</b> has been cancelled.</p>
      <p><b>Date:</b> ${appointment.slotDate}</p>
      <p><b>Time:</b> ${appointment.slotTime}</p>
      <p><b>Fees:</b> ${appointment.doctor.fees}</p>
      <p>No further action is required.</p>
    `;

    await sendEmail(
      appointment.user.email,
      "Appointment Cancelled",
      emailHtml,
      appointment.doctor.email
    );

    
    // Delete appointment
    await Appointment.findByIdAndDelete(appointmentId);

    res
      .status(200)
      .json({
        success: true,
        message: "Appointment Cancelled And Deleted",
        appointment,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      errors: ["Server error" + error.message],
    });
  }
};

const handleDeleteDoctor=async(req,res)=>{
try {
  //Auhtorize  admin only
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ success: false, error: ["Not Authorized. Please Login Again"] });
    }
  const doctorId=req.params.doctorId;

  const doctor=await Doctor.findByIdAndDelete(doctorId)

  if(!doctor){
    return res.status(404).json({success:false,errors:["Doctor not found"]})
  }

  res.status(200).json({success:true,message:"Doctor Deleted Successfullys"})

  
} catch (error) {
  res.status(500).json({
      success: false,
      errors: ["Server error" + error.message],
    });
}
}

handleAdminLogin.validate = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

handleAddDoctor.validate = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  body("speciality").notEmpty().withMessage("Speciality is required"),
  body("degree").notEmpty().withMessage("Degree is required"),

  body("experience")
    .isInt({ min: 0 })
    .withMessage("Experience must be a non-negative number"),

  body("about").notEmpty().withMessage("About field is required"),

  body("fees")
    .isFloat({ min: 0 })
    .withMessage("Fees must be a positive number"),

  body("address.street").notEmpty().withMessage("Street is required"),
  body("address.city").notEmpty().withMessage("City is required"),
  body("address.state").notEmpty().withMessage("State is required"),
  body("address.postalCode").notEmpty().withMessage("Postal Code is required"),
  body("address.country").notEmpty().withMessage("Country is required"),
];

export {
  handleAdminLogin,
  handleAddDoctor,
  handleAllDoctors,
  handleAllAppointments,
  handleDashBoard,
  handleCancelAndDeleteAppointment,
  handleDeleteDoctor
};
