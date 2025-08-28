import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {loginSuccess} from '../redux/userSlice.js'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const LoginModal = ({ setShowModal }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch=useDispatch()
  const navigate=useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
     e.preventDefault();
    
    const backendUrl=import.meta.env.VITE_BACKEND_URL
    // login
    try {
      const response = await axios.post(`${backendUrl}/user/login`, {
        ...formData,
      });
      console.log(response)
      if (response?.data?.success) {
        dispatch(loginSuccess(response?.data?.token))
      }
      toast.success(response?.data?.message, {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      setFormData({
        email: "",
        password: "",
      });
      navigate("/")
    } catch (error) {
      console.log(error)
      if (!error.response?.data?.success) {
        error.response?.data?.errors.forEach((err) => {
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
    <div className="modal modal-open">
      <div className="modal-box relative">
        {/* Close Button */}
        <button
        type="button"
          onClick={() => setShowModal(false)}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
        <h3 className="font-bold text-lg mb-4">Login</h3>
        <p>Please login to book appointment</p>
        <form className="space-y-4 py-4" onSubmit={handleSubmit}>
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

          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="input input-primary w-full"
            />
          </div>
          <div className="flex w-full flex-col">
            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>

            <div className="divider">OR</div>
            <p className="text-info-content text-center">
              Create a new account?{" "}
              <span
                onClick={() => {
                  setShowModal(false);
                  scrollTo(0, 0);
                }}
                className="link link-primary"
              >
                click here
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
