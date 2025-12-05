import React from "react";
import { Link } from "react-router-dom";

const Casting = ({ id, name, char, job, image, className }) => {
  return (
    <Link to={`/person/${id}`} className={className}>
      <div className=" w-50  h-70 hover:cursor-pointer  ">
        <div>
          <div className="relative w-50 h-50 overflow-hidden">
            <img
              className=" rounded-full object-cover w-full h-full"
              src={image}
              alt={name}
            />
          </div>
          <div className="overflow-visible text-center">
            <h1 className=" font-bold text-grey-50 line-clamp-1 wrap-break-word w-50 mt-3 ">
              {name}
            </h1>
            <p className="mt-1 line-clamp-1 wrap-break-word w-50">{char}</p>
            <p className="">{job}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Casting;
