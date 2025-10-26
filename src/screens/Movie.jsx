import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import fetchMovies from "../tools/fetchMovie";
import { MainBar } from "../components/MainBar";

const Movie = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const { id } = useParams();

  useEffect(() => {
    // fetching the movie details using an id
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const url = `https://api.themoviedb.org/3/movie/${id}`;
        await fetchMovies(url).then((data) => setMovie(data));
      } catch (error) {
        setErr(error);
        console.log(err);
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
  console.log(movie.genres);
  return (
    <>
      <MainBar />
      <div className="relative">
        <div className="fixed w-fit">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt="poster"
            className="w-120 rounded-[80px] p-10"
          />
        </div>
        <div className="left-110 w-200 fixed m-15 text-white">
          <h1 className="text-6xl font-bold">{movie.title}</h1>
          <br />
          <p className="text-1xl text-gray-500">{movie.overview}</p>
          <br />
          <p className="border-gray-800 p-5 rounded-3xl bg-indigo-950 w-fit ">
            released on : {movie.release_date}
          </p>
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
