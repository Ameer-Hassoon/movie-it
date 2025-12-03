import React from "react";
// import starRating from "../tools/rating";
import { Link } from "react-router-dom";
import { Tools } from "../tools/utils";

const MovieCard = ({ id, title, rating, image, year }) => {
  const tools = new Tools();
  return (
    <>
      <Link to={`/movie/${id}`}>
        <div>
          <div className=" bg-sky-950  w-71 h-130  m-5 p-2 rounded-lg border-gray-500 border-5 shadow-lg hover:cursor-pointer hover:scale-102 transition-transform ">
            <div>
              <div className="relative">
                <img
                  className=" w-full h-96 rounded-lg shadow-lg "
                  src={image}
                  alt="movie poster"
                />
              </div>
              <div className="overflow-visible">
                <h1 className=" font-bold text-grey-50 line-clamp-1 wrap-break-word w-65 mt-5 ">
                  {title}
                </h1>
                <p className="mt-2">{tools.starRating(rating)}</p>
                <p className="mt-1">{year}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default MovieCard;
