import React from "react";
import { assets } from "../assets/assets_frontend/assets";
import { NavLink } from "react-router-dom";
const Footer = () => {
  return (
    <div className=" mx-3 md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* ---------- Left Section ---------- */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>

        {/* ---------- Center Section ---------- */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-4 py-2 ${
                    isActive ? "text-blue-600 font-bold" : "text-gray-700"
                  }`
                }
              >
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/doctors"
                className={({ isActive }) =>
                  `px-4 py-2 ${
                    isActive ? "text-blue-600 font-bold" : "text-gray-700"
                  }`
                }
              >
                ALL DOCTORS
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `px-4 py-2 ${
                    isActive ? "text-blue-600 font-bold" : "text-gray-700"
                  }`
                }
              >
                ABOUT
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `px-4 py-2 ${
                    isActive ? "text-blue-600 font-bold" : "text-gray-700"
                  }`
                }
              >
                CONTACT
              </NavLink>
            </li>
          </ul>
        </div>

        {/* ---------- Right Section ---------- */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+1-212-456-7890</li>
            <li>georgesamson@prescrepto.com</li>
          </ul>
        </div>
      </div>

      {/* ---------- Copyright Text ---------- */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright © 2024 - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
