import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TopBar } from "../components/TopBar";
import Casting from "../components/Casting";
import { Tools } from "../tools/utils";

const MovieDetails = () => {
  const tools = new Tools("movies");
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ageRating, setAgeRating] = useState(null);
  const [err, setErr] = useState("");
  const [trailerURL, setTrailerURL] = useState("");
  // const [crew, setCrew] = useState([]);
  const [cast, setCast] = useState([]);

  const handelClick = () => {
    window.open(trailerURL, "_black", "noopener,noreferrer");
  };
  const { id } = useParams();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);

        const detailsUrl = `https://api.themoviedb.org/3/movie/${id}`;
        const movieData = await tools.fetchMovies(detailsUrl);
        setMovie(movieData);

        const ratingUrl = `https://api.themoviedb.org/3/movie/${id}/release_dates`;
        const ratingData = await tools.fetchMovies(ratingUrl);
        const krData = ratingData.results.find((r) => r.iso_3166_1 === "KR");
        setAgeRating(
          krData && krData.release_dates.length > 0
            ? krData.release_dates[0].certification || "N/A"
            : "N/A"
        );

        const trailerUrl = `https://api.themoviedb.org/3/movie/${id}/videos`;
        const trailerData = await tools.fetchMovies(trailerUrl);
        const trailer = trailerData.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );

        setTrailerURL(
          trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : ""
        );

        const crewUrl = `https://api.themoviedb.org/3/movie/${id}/credits`;
        const data = await tools.fetchMovies(crewUrl);
        // setCrew(data.crew || []);
        setCast(data.cast || []);
      } catch (error) {
        setErr(error);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);
  const combinedArray = [...cast];
  // delete the elements that don't have a poster
  const newCombinedArray = combinedArray.filter((n) => n.profile_path > "");
  // delete the duplicated elements
  const finalArray = newCombinedArray.filter(
    (user, index, self) => index === self.findIndex((u) => u.id === user.id)
  );
  //if loading is succsuful than run the remining code
  if (loading) {
    return <div>loading movie</div>;
  }
  return (
    <>
      <TopBar />
      <div className="relative">
        <div className="absolute w-fit ">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt="poster"
            className="w-120 rounded-[80px] p-15"
          />
        </div>
        <button
          className="w-90 left-15 h-13 bg-red-800 rounded-4xl relative text-[20px] hover:cursor-pointer top-155 "
          onClick={handelClick}
        >
          watch trailer
        </button>
        <div className="left-110 w-200 absolute m-15 mt-10">
          <h1 className="text-5xl font-bold">{movie.title}</h1>
          <p className="mt-5 mb-3">
            {tools.starRating(movie.vote_average)} ({movie.vote_count})
          </p>

          <p className="text-1xl  text-gray-300">{movie.overview}</p>
          <br />
          <p className=" pb-3 rounded-3xl w-fit text-white">
            Released on : {tools.releaseDate(movie)}
          </p>
          {ageRating === "N/A" ? (
            <div className="  pl-6 pr-6 w-fit pt-2 pb-2 mt-2 rounded-4xl text-1xl top-165 left-10 text-center">
              <p></p>
            </div>
          ) : (
            <div className="bg-[rgb(24,24,24,1)]  pl-6 pr-6 w-fit pt-2 pb-2 mt-2 rounded-4xl text-1xl top-165 left-10 text-center">
              <p>Age : {ageRating.toLowerCase()}</p>
            </div>
          )}
          <div className="flex gap-4 flex-wrap w-full mt-5">
            {movie.genres.map((genre) => {
              return (
                <p
                  key={genre.id}
                  className="border-gray-800 pl-5 pr-5 pt-2 pb-2 rounded-3xl bg-sky-950 w-fit "
                >
                  {genre.name}
                </p>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap mt-180 items-center justify-center w-full">
        {finalArray.map((mem) => {
          return (
            <Casting
              className="scale-x-75 scale-y-75 -m-3 -ml"
              key={mem.id}
              image={`https://image.tmdb.org/t/p/w200${mem.profile_path}`}
              name={mem.name}
              char={mem.character}
              id={mem.id}
              // job={mem.known_for_department}
            />
          );
        })}
      </div>
    </>
  );
};

export default MovieDetails;
