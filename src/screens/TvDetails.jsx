import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tools } from "../tools/utils";
import { TopBar } from "../components/TopBar";
import Casting from "../components/Casting";

const TvDetails = () => {
  const tools = new Tools("shows");
  const [tvShowDetails, setTvShowDetails] = useState(null);
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

        const detailsUrl = `https://api.themoviedb.org/3/tv/${id}`;
        const movieData = await tools.fetchMovies(detailsUrl);
        setTvShowDetails(movieData);

        const ratingUrl = `https://api.themoviedb.org/3/tv/${id}/content_ratings`;
        const ratingData = await tools.fetchMovies(ratingUrl);
        const krData = ratingData.results.find((r) => r.iso_3166_1 === "KR");
        setAgeRating(krData ? krData.rating : "N/A");

        const trailerUrl = `https://api.themoviedb.org/3/tv/${id}/videos`;
        const trailerData = await tools.fetchMovies(trailerUrl);

        const trailer = trailerData.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );

        setTrailerURL(
          trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : ""
        );

        const creditsUrl = `https://api.themoviedb.org/3/tv/${id}/credits`;
        const creditsData = await tools.fetchMovies(creditsUrl);
        // setCrew(creditsData.crew || []);
        setCast(creditsData.cast || []);
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
  //if loading is succsuful than run the remining code
  if (loading) {
    return <div>loading show....</div>;
  }
  const newCombinedArray = combinedArray.filter((i) => i.profile_path > "");
  const finalArray = newCombinedArray.filter(
    (user, index, self) => index === self.findIndex((u) => u.id === user.id)
  );
  return (
    <>
      <TopBar />
      <div className="relative">
        <div className="absolute w-fit ">
          <img
            src={`https://image.tmdb.org/t/p/w500${tvShowDetails.poster_path}`}
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
        <div className="left-110 w-200 absolute m-15 mt-10 text-white">
          <h1 className="text-6xl font-bold">{tvShowDetails.name}</h1>
          <p className="mt-3 mb-3">
            {tools.starRating(tvShowDetails.vote_average)} (
            {tvShowDetails.vote_count})
          </p>

          <p className="text-1xl text-gray-300">{tvShowDetails.overview}</p>
          <br />
          <p className="border-gray-800 pb-3 rounded-3xl  w-fit ">
            released on : {tools.releaseDate(tvShowDetails)}
          </p>
          {ageRating === "N/A" ? (
            <div className=" text-stone-50 pl-6 pr-6 w-fit pt-2 pb-2 mt-2 rounded-4xl text-1xl top-165 left-10 text-center">
              <p></p>
            </div>
          ) : (
            <div className="bg-[rgb(24,24,24,1)] text-stone-50 pl-6 pr-6 w-fit pt-2 pb-2 mt-2 rounded-4xl text-1xl top-165 left-10 text-center">
              <p>Age : {ageRating}</p>
            </div>
          )}
          <div className="flex gap-4 flex-wrap w-full mt-5">
            {tvShowDetails.genres.map((genre) => {
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
      <div className="flex flex-wrap justify-center items-center mt-180 absolute">
        {finalArray.map((mem) => {
          return (
            <Casting
              className="scale-x-75 scale-y-75 -m-3 -ml"
              key={mem.id}
              image={`https://image.tmdb.org/t/p/w185${mem.profile_path}`}
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

export default TvDetails;
