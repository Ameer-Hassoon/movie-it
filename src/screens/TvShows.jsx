import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import fetchMovies from "../tools/fetchMovie";
import { MainBar } from "../components/MainBar";
import starRating from "../tools/rating";
import { TopBar } from "../components/TopBar";

const TvShow = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ageRating, setAgeRating] = useState(null);
  const [err, setErr] = useState("");
  const [trailerURL, setTrailerURL] = useState("");

  const handelClick = () => {
    window.open(trailerURL, "_black", "noopener,noreferrer");
  };

  const { id } = useParams();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);

        const detailsUrl = `https://api.themoviedb.org/3/tv/${id}`;
        const movieData = await fetchMovies(detailsUrl);
        setMovie(movieData);

        const ratingUrl = `https://api.themoviedb.org/3/tv/${id}/content_ratings`;
        const ratingData = await fetchMovies(ratingUrl);
        const krData = ratingData.results.find((r) => r.iso_3166_1 === "KR");
        setAgeRating(krData ? krData.rating : "N/A");

        const trailerUrl = `https://api.themoviedb.org/3/tv/${id}/videos`;
        const trailerData = await fetchMovies(trailerUrl);

        const trailer = trailerData.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );

        setTrailerURL(
          trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : ""
        );
      } catch (error) {
        setErr(error);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  //if loading is succsuful than run the remining code
  if (loading) {
    return <div>loading show....</div>;
  }

  return (
    <>
      <TopBar />
      <div className="relative">
        <div className="absolute w-fit ">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt="poster"
            className="w-120 rounded-[80px] p-10"
          />
        </div>
        <button
          className="w-100 left-10 h-15 bg-red-900 rounded-4xl relative text-[20px] hover:cursor-pointer top-165 "
          onClick={handelClick}
        >
          watch trailer
        </button>
        <div className="left-110 w-200 fixed m-15 mt-10 text-white">
          <h1 className="text-6xl font-bold">{movie.name}</h1>
          <p className="mt-3 mb-3">
            ⭐ {starRating(movie.vote_average)}/5 ({movie.vote_count})
          </p>

          <p className="text-1xl text-gray-500">{movie.overview}</p>
          <br />
          <p className="border-gray-800 pb-3 rounded-3xl  w-fit ">
            released on :{" "}
            {movie.first_air_date ? movie.first_air_date.split("-")[0] : "N/A"}
          </p>
          {ageRating === "no rating" ? (
            <div className=" text-stone-50 pl-6 pr-6 w-fit pt-2 pb-2 mt-2 rounded-4xl text-1xl top-165 left-10 text-center">
              <p></p>
            </div>
          ) : (
            <div className="bg-black text-stone-50 pl-6 pr-6 w-fit pt-2 pb-2 mt-2 rounded-4xl text-1xl top-165 left-10 text-center">
              <p>Age : {ageRating}</p>
            </div>
          )}
          <div className="flex gap-4 flex-wrap w-full mt-5">
            {movie.genres.map((genre) => {
              return (
                <p
                  key={genre.id}
                  className="border-gray-800 pl-5 pr-5 pt-2 pb-2 rounded-3xl bg-indigo-950 w-fit "
                >
                  {genre.name}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default TvShow;
