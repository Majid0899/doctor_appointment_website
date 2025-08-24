import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User",required:true},
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor",required:true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    amount: { type: Number, required: true },
    bookedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
      lowercase:true
    },
    payment: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Appointment =
  mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

export default Appointment;
