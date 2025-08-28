import React from "react";
import { Link} from "react-router-dom";
import useDoctor from '../utils/useData.js'

const TopDoctors = () => {
 
   const { data, loading, serverError } = useDoctor("user/all-doctors");
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>

     { serverError && <p className="text-red-500">{serverError}</p>}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-5 gap-y-6 px-3 sm:px-0">
        {!loading && data?.doctors?.length >0 ? (data.doctors.map((doctor)=>(
            <div key={doctor._id} className={`${loading ? 'skeleton ':'card bg-base-200  w-88 lg:w-70 shadow-sm' }`}>
  <figure className="px-10 pt-10">
    <img
      src={doctor.image}
      alt=""
      className="rounded-xl w-30 h-40" />
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title">{doctor.name}</h2>
    <h3>{doctor.speciality}</h3>
    <h4 className="font-bold">Experience:<span className="font-light">{doctor.experience} Years</span></h4>
    <p>{doctor.about}</p>
    <div className="card-actions">
      <button className="btn btn-primary">Book Appointment</button>
    </div>
  </div>
</div>
        ))):(<div className="flex bg-base-100 justify-center item-center">
          <p>{data.message}</p>
        </div>)}
      </div>
      <Link to="/doctors"><button
        className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10"
      >
        more
      </button></Link>
    </div>
  );
};

export default TopDoctors;
