import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Camera } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [preview, setPreview] = useState(null); // local preview for image

  const [formData, setFormData] = useState(null);
  const [address, setAddress] = useState(null);

  const fileInputRef = useRef(null);
  const { token, user, loading, error } = useSelector((state) => state.user);

  if (!token) {
    return <Navigate to="/" />;
  }
  console.log(userData)

  useEffect(() => {
    if (!loading && user) {
      setUserData(user);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth) // always store as JS Date object
          : null,
        gender: user.gender || "",
        password: "",
        image: null,
      });
      setAddress({
        state: user.address?.state || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        postalCode: user.address?.postalCode || "",
        country: user.address?.country || "",
      });
    }
  }, [user, loading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleAddress = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // live preview update
      };
      reader.readAsDataURL(file);
    }
    setFormData({ ...formData, image: { file } });
  };

  const handleSave = async () => {
    setEditMode(false);

    const formPayload = new FormData(); // for sending files

    //password
    if (formData.password) {
      formPayload.append("password", formData.password);
    }

    //image field
    if (formData.image?.file) {
      formPayload.append("image", formData.image.file);
    }
    // address check
    const addressChanged = Object.keys(address).some(
      (key) => address[key] !== userData?.address?.[key]
    );
    if (addressChanged) {
      formPayload.append("address", JSON.stringify(address));
    }

    //dateofBirth
    if (formData.dateOfBirth) {
      formPayload.append("dateOfBirth", formData.dateOfBirth);
    }
    //name,email,phone,gender
    ["name", "email", "phone", "gender"].forEach((field) => {
      if (formData[field] && formData[field] !== userData[field]) {
        formPayload.append(field, formData[field]);
      }
    });

    for (let pair of formPayload.entries()) {
      console.log(pair[0], pair[1]);
    }
    // send data
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await axios.put(
        `${backendUrl}/user/profile/update`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedData = response?.data?.user;

      setUserData(updatedData);
      setFormData({
        name: updatedData.name || "",
        email: updatedData.email || "",
        phone: updatedData.phone || "",
        dateOfBirth: updatedData.dateOfBirth
          ? new Date(updatedData.dateOfBirth)
          : null,
        gender: updatedData.gender || "",
        password: "",
        image: null,
      });
      setAddress({
        state: updatedData.address?.state || "",
        street: updatedData.address?.street || "",
        city: updatedData.address?.city || "",
        postalCode: updatedData.address?.postalCode || "",
        country: updatedData.address?.country || "",
      });

      toast.success(response?.data?.message, {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    } catch (error) {
      if (!error.response?.data?.success) {
        error.response?.data.errors.forEach((err) => {
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
    <>
      {loading ? (
        <div className="flex justify-center items-center bg-base-200 p-4 w-full">
          <div className="bg-base-100 shadow-md shadow-amber-400 rounded-2xl w-full max-w-4xl p-6 animate-pulse">
            {/* Top Section Skeleton */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image Skeleton */}
              <div className="flex justify-center">
                <div className="skeleton w-44 h-44 "></div>
              </div>

              {/* Info Skeleton */}
              <div className="flex-1 space-y-4">
                <div className="skeleton h-6 w-1/3"></div>
                <div className="skeleton h-4 w-2/3"></div>
                <div className="skeleton h-4 w-1/2"></div>
                <div className="flex gap-2">
                  <div className="skeleton h-6 w-20"></div>
                  <div className="skeleton h-6 w-28"></div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Address + Security Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="skeleton h-5 w-1/4"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-3/4"></div>
                <div className="skeleton h-4 w-2/3"></div>
              </div>
              <div className="space-y-3">
                <div className="skeleton h-5 w-1/3"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-1/2"></div>
              </div>
            </div>

            {/* Button Skeleton */}
            <div className="flex justify-end mt-6">
              <div className="skeleton h-10 w-24 rounded-lg"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center bg-base-200 p-4">
          <div className="bg-base-100 shadow-md shadow-amber-400 rounded-2xl w-full max-w-4xl overflow-hidden">
            {/* Top Section */}
            <div className="flex flex-col md:flex-row">
              {/* User Image */}
              <div className="flex justify-center p-6 md:p-8 relative">
                <img
                  src={preview || `${import.meta.env.VITE_BACKEND_URL}${userData?.image}`}

                  alt="User"
                  className="w-44 h-44 object-cover border border-amber-400 shadow-lg"
                />

                {/* Camera Icon for Edit */}
                {editMode && (
                  <span
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-13 right-10 bg-white p-2 rounded-full shadow-md cursor-pointer"
                  >
                    <Camera className="text-amber-600 h-6 w-6" />
                  </span>
                )}

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* User Basic Info */}
              <div className="flex-1 p-6 md:p-8">
                <div className="flex gap-x-0.5">
                  {editMode ? (
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="my-1 input input-primary w-full"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-amber-600">
                      {userData?.name}
                    </h2>
                  )}
                </div>
                <div className="flex gap-x-0.5">
                  {editMode ? (
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="my-1 input input-primary w-full"
                    />
                  ) : (
                    <p className="text-gray-700">{userData?.email}</p>
                  )}
                </div>
                <div className="flex gap-x-0.5">
                  {editMode ? (
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="input input-primary w-full"
                    />
                  ) : (
                    <p className="text-gray-500">{userData?.phone}</p>
                  )}
                </div>
                {/* Gender */}
                <div className="mt-4 flex flex-wrap gap-3">
                  <div className="flex gap-0.5">
                    {editMode ? (
                      <div>
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
                                  setFormData((prev) => ({
                                    ...prev,
                                    gender: "male",
                                  }))
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
                                  setFormData((prev) => ({
                                    ...prev,
                                    gender: "female",
                                  }))
                                }
                              >
                                Female
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    gender: "Other",
                                  }))
                                }
                              >
                                Other
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <span className="badge badge-outline">
                        {userData?.gender.toUpperCase()}{" "}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-0.5">
                    {editMode ? (
                      <DatePicker
                        id="dateOfBirth"
                        dateFormat="dd-MM-yyyy"
                        selected={formData.dateOfBirth}
                        onChange={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            dateOfBirth: date,
                          }));
                        }}
                        placeholderText="Select your date of birth"
                        className="input input-primary w-full"
                        popperPlacement="bottom-start"
                        wrapperClassName="w-full"
                      />
                    ) : (
                      <span className="badge badge-outline">
                        DOB:{userData?.dateOfBirth}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Address Section */}
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {editMode ? (
                  <>
                    <fieldset className="fieldset bg-base-200  border-base-300 rounded-box  border p-4">
                      <legend className="fieldset-legend text-xl">
                        Address
                      </legend>

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
                  </>
                ) : (
                  <>
                    <h3 className="text-lg flex gap-x-0.5 font-semibold text-amber-600 mb-2">
                      Address
                    </h3>
                    <p className="text-gray-600">
                      {userData?.address.street}, <br />
                      {userData?.address.city}, {userData?.address.state},{" "}
                      <br />
                      {userData?.address.postalCode},{" "}
                      {userData?.address.country}
                    </p>
                  </>
                )}
              </div>

              {/* Security Info */}
              <div>
                <h3 className="text-lg font-semibold text-amber-600 mb-2">
                  Account Info
                </h3>
                {editMode ? (
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="input input-primary w-full"
                  />
                ) : (
                  <p className="text-gray-600 ">
                    <span className="font-medium">Password: </span> ********
                  </p>
                )}

                <p className="text-gray-600">
                  <span className="font-medium">Joined: </span>
                  {userData?.createdAt}
                </p>
              </div>
            </div>

            {/* Save Profile */}
            {editMode ? (
              <div className="flex justify-end p-6">
                <button
                  onClick={handleSave}
                  className="btn bg-green-500 text-white hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex justify-end p-6">
                <button
                  onClick={() => setEditMode(true)}
                  className="btn bg-green-500 text-white hover:bg-green-600"
                >
                  Edit All
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MyProfile;
