import { useState } from "react";
import { NavLink,Link } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        {/* LEFT SIDE */}
        <div className="navbar-start flex items-center gap-2">
          {/* Hamburger button */}
          <button
            onClick={() => setIsOpen(true)}
            className="btn btn-square btn-ghost lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </button>

          {/* LOGO */}
          <div className="px-4">
            <Link to="/"><img className="w-44 cursor-pointer" src={assets.logo} alt="" /></Link>
          </div>
        </div>

        {/* Menu  */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex gap-3 px-1">
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

        {/* RIGHT */}
        <div className="navbar-end">
          <Link to="/signup"><button className="btn text-white bg-blue-600 rounded-2xl">Create Account</button></Link>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      {isOpen && (
        <div
          className="fixed inset-0  z-40"
          onClick={() => setIsOpen(false)} 
        >
          <div
            className="w-80 bg-base-200 min-h-full p-4 z-50"
            onClick={(e) => e.stopPropagation()} 
          >
            <ul className="menu menu-vertical gap-6">
              <li>
                <NavLink
                  to="/"
                  onClick={() => setIsOpen(false)}
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
                  onClick={() => setIsOpen(false)}
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
                  onClick={() => setIsOpen(false)}
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
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2 ${
                      isActive ? "text-blue-600 font-bold" : "text-gray-700"
                    }`
                  }
                >
                  CONTACT
                </NavLink>
              </li>
              <div className="px-4">
          <button className="btn bg-blue-600 text-white">Logout</button>
        </div>
            </ul>
            
          </div>
          
        </div>
      )}
      
    </>
  );
};

export default Navbar;
