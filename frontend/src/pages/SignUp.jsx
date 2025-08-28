import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoginModal from "../components/LoginModal";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../redux/userSlice";

const SignUp = () => {
  const [startDate, setStartDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  });
  const [address, setAddress] = useState({
    state: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const dispatch=useDispatch()
  const navigate=useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleAddress = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    //send data
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await axios.post(`${backendUrl}/user/register`, {
        ...formData,
        address,
      });
      if (response?.data?.success) {
        dispatch(loginSuccess(response?.data?.token))
      }

      toast.success(response?.data?.message, {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
      });
      setAddress({
        state: "",
        street: "",
        city: "",
        postalCode: "",
        country: "",
      });
      navigate("/")
    } catch (error) {
      if (!error.response?.data?.success) {
        error.response.data.errors.forEach((err) => {
          toast.error(err, {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          });
        });
      } else {
        toast.error("An unexpected Server Error Occured", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form className="py-2" onSubmit={handleSubmit}>
        <fieldset className="fieldset bg-base-500 max-w-3xl border-base-300 rounded-box  border mx-2 p-4">
          <legend className="fieldset-legend text-xl">
            Personal Informtion
          </legend>

          <div className="flex gap-2 flex-col justify-center ">
            {/* Name */}
            <div>
              <label htmlFor="name" className="label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="input input-primary w-full"
              />
            </div>
            {/* Email */}
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="input input-primary w-full"
              />
            </div>
            {/* Password */}
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input input-primary w-full"
              />
            </div>
            <div>
              <label htmlFor="phone" className="label">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="input input-primary w-full"
              />
            </div>

            {/* Address */}
            <div>
              <fieldset className="fieldset bg-base-200  border-base-300 rounded-box  border p-4">
                <legend className="fieldset-legend text-xl">Address</legend>

                <div className="flex gap-2 ">
                  {/* Street */}
                  <div>
                    <label htmlFor="street" className="label">
                      Street
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={address.street}
                      onChange={handleAddress}
                      placeholder="Enter street"
                      className="input input-primary w-full"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleAddress}
                      placeholder="Enter city"
                      className="input input-primary  w-full"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* State */}
                  <div>
                    <label className="label">State</label>
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleAddress}
                      placeholder="Enter state"
                      className="input input-primary w-full"
                    />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="label">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={address.postalCode}
                      onChange={handleAddress}
                      placeholder="Enter postal code"
                      className="input input-primary w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={address.country}
                    onChange={handleAddress}
                    placeholder="Enter country"
                    className="input input-primary w-full"
                  />
                </div>
              </fieldset>
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="label">
                Gender
              </label>

              <div className="dropdown w-full">
                <label
                  tabIndex={0}
                  className="select select-primary w-full  cursor-pointer"
                >
                  {formData.gender || "Select Gender"}
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full text-center"
                >
                  <li>
                    <button
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, gender: "male" }))
                      }
                      type="button"
                    >
                      Male
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, gender: "female" }))
                      }
                    >
                      Female
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, gender: "Other" }))
                      }
                    >
                      Other
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="label">
                Date of Birth
              </label>
              <div className="w-full">
                <DatePicker
                  id="dateOfBirth"
                  selected={formData.dateOfBirth}
                  onChange={(date) => {
                    setStartDate(date);
                    setFormData((prev) => ({ ...prev, dateOfBirth: date }));
                  }}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select your date of birth"
                  className="input input-primary w-full"
                  popperPlacement="bottom-start"
                  wrapperClassName="w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col">
            <button type="submit" className="btn btn-primary w-full">
              Create Account
            </button>

            <div className="divider">OR</div>
            <p className="text-info-content text-center">
              Already have an account?{" "}
              <span
                onClick={() => setShowModal(true)}
                className="link link-primary"
              >
                Login
              </span>
            </p>
          </div>
        </fieldset>
        
       
      </form>
      {/* Login Modal */}
       {showModal && <LoginModal setShowModal={setShowModal} />}
    </div>
  );
};

export default SignUp;
