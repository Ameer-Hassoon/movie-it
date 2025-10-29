import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import fetchMovies from "../tools/fetchMovie";
import { MainBar } from "../components/MainBar";
import starRating from "../tools/rating";

const Movie = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ageRating, setAgeRating] = useState(null);
  const [err, setErr] = useState("");

  const { id } = useParams();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);

        // 1) Fetch movie details
        const detailsUrl = `https://api.themoviedb.org/3/movie/${id}`;
        const movieData = await fetchMovies(detailsUrl);
        setMovie(movieData);

        // 2) Fetch Korean Age Rating
        const ratingUrl = `https://api.themoviedb.org/3/movie/${id}/release_dates`;
        const ratingData = await fetchMovies(ratingUrl);

        // Extract KR rating
        const krData = ratingData.results.find((r) => r.iso_3166_1 === "KR");
        if (krData && krData.release_dates.length > 0) {
          setAgeRating(krData.release_dates[0].certification || "N/A");
        } else {
          setAgeRating("N/A");
        }
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
    return <div>loading movie</div>;
  }
  console.log(movie);
  return (
    <>
      <MainBar />
      <div className="relative">
        <div className="fixed w-fit ">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt="poster"
            className="w-120 rounded-[80px] p-10"
          />
        </div>
        <div className="left-110 w-200 fixed m-15 text-white">
          <h1 className="text-6xl font-bold">{movie.title}</h1>
          <p className="mt-3 mb-3">{starRating(movie.vote_average)}/5 ⭐</p>

          <p className="text-1xl text-gray-500">{movie.overview}</p>
          <br />
          <p className="border-gray-800 p-5 rounded-3xl bg-indigo-950 w-fit ">
            released on : {movie.release_date}
          </p>

          <div className="bg-black text-stone-50 w-30 pt-2 pb-2 mt-2 rounded-4xl text-1xl top-165 left-10 text-center">
            <p>Age : {ageRating}</p>
          </div>

          <div className="flex gap-4 flex-wrap w-full mt-10">
            {movie.genres.map((genre) => {
              return (
                <p
                  key={genre.id}
                  className="border-gray-800 p-5 rounded-3xl bg-indigo-950 w-fit "
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

export default Movie;
