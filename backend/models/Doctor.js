import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false }, 
    image: { type: String, default:"https://i.pravatar.cc/150?img=1"}, 
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: Number, required: true, min: 0 },
    about: { type: String,required:true }, 
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true, min: 0 },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    date: { type: Date, default: Date.now }, 
    slots_booked: {
  type: Map,
  of: [String], // each key is a date, value = array of times
  default: {}
}
 
  },
  { minimize: false, timestamps: true }
);


doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

doctorSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Doctor =mongoose.model("Doctor", doctorSchema);

export default Doctor;


