import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false }, 
    image: { type: String, default:"https://sdmntprwestus2.oaiusercontent.com/files/00000000-201c-61f8-944b-03a38efa388f/raw?se=2025-08-26T17%3A48%3A50Z&sp=r&sv=2024-08-04&sr=b&scid=d0864edd-d786-5297-909b-d23f341c1622&skoid=03727f49-62d3-42ac-8350-1c0e6559d238&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-08-26T13%3A13%3A47Z&ske=2025-08-27T13%3A13%3A47Z&sks=b&skv=2024-08-04&sig=lR0n2AVqQHwxEcvlz9sHO2HvvuJda4kcN/ogAtXuVjE%3D"}, 
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


