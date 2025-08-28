import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";
import { useDispatch, useSelector } from "react-redux";
import { logout, userProfile } from "../redux/userSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const { token, user, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (token) {
      dispatch(userProfile(token));
    }
  }, [dispatch, token]); // runs when token changes

  console.log(loading, error, user);

  const handleLogout=()=>{
    dispatch(logout())
  }
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
            <Link to="/">
              <img className="w-44 cursor-pointer" src={assets.logo} alt="" />
            </Link>
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
        {token ? (
          <div className="dropdown dropdown-bottom navbar-end avatar">
            <div tabIndex={0} className="ring-primary ring-offset-base-100 w-12 h-12 rounded-full ring-2 ring-offset-2">
              <img src={user?.image} />
            </div>
            <ul tabIndex={0} className="menu my-1 dropdown-content bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm">
              <li>
                <Link to="/myprofile">MyProfile</Link>
              </li>
              <li>
                <Link to="/appointments">Appointments</Link>
              </li>
              <div>
                <button onClick={handleLogout}className="btn hover:bg-red-600">Logout</button>
              </div>
            </ul>
          </div>
        ) : (
          <div className="navbar-end">
            <Link to="/signup">
              <button className="btn text-white bg-blue-600 rounded-2xl">
                Create Account
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* MOBILE SIDEBAR */}
      {isOpen && (
        <div className="fixed inset-0  z-40" onClick={() => setIsOpen(false)}>
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
              
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
