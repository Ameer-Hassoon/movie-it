import React from "react";
import { Link } from "react-router-dom";
import { Tools } from "../tools/utils";

const Card = ({ id, title, rating, image, year, type }) => {
  const tools = new Tools();
  return (
    <>
      <Link to={type == "movie" ? `/movie/${id}` : `/tvShows/${id}`}>
        <div>
          <div className=" bg-sky-950  w-60 h-124  m-5  rounded-lg  shadow-lg hover:cursor-pointer hover:scale-102 transition-transform ">
            <div>
              <div className="relative">
                <img
                  className=" w-full  rounded-t-lg shadow-lg "
                  src={image}
                  alt="movie poster"
                />
              </div>
              <div className="overflow-visible pl-4 pr-4">
                <h1 className=" font-bold line-clamp-1 wrap-break-word w-52 mt-5 ">
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

export default Card;
