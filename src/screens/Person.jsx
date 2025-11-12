import React, { useEffect, useState } from "react";
import { TopBar } from "../components/TopBar";
import fetchMovies from "../tools/fetchMovie";
import { useParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import TvCard from "../components/TvCard";

const Person = () => {
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({});
  const [movieCast, setMovieCast] = useState([]);
  const [movieCrew, setMovieCrew] = useState([]);
  const [tvCrew, setTvCrew] = useState([]);
  const [tvCast, setTvCast] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const castDetails = async () => {
      try {
        setLoading(true);

        const personUrl = `https://api.themoviedb.org/3/person/${id}`;
        const personData = await fetchMovies(personUrl);
        setDetails(personData);

        const worksUrl = `https://api.themoviedb.org/3/person/${id}/movie_credits`;
        const worksData = await fetchMovies(worksUrl);
        setMovieCast(worksData.cast || []);
        setMovieCrew(worksData.crew || []);

        const tvUrl = `https://api.themoviedb.org/3/person/${id}/tv_credits`;
        const tvData = await fetchMovies(tvUrl);
        setTvCast(tvData.cast || []);
        setTvCrew(tvData.crew || []);
      } catch (error) {
        setErr(error);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    castDetails();
  }, []);
  //**********************************the movies*******************************
  const combinedArrayMovie = [...movieCast, ...movieCrew];
  const notValuableArrayMovie = combinedArrayMovie.filter(
    (e) => e.poster_path > ""
  );
  const finalArrayMovie = notValuableArrayMovie.filter(
    (user, index, self) => index === self.findIndex((u) => u.id === user.id)
  );
  // *********************************the tv shows******************************
  const combinedArrayTv = [...tvCast, ...tvCrew];
  const notValuableArrayTv = combinedArrayTv.filter((e) => e.poster_path > "");
  const finalArrayTv = notValuableArrayTv.filter(
    (user, index, self) => index === self.findIndex((u) => u.id === user.id)
  );
  // if sucss load the page
  if (loading) {
    return <p>loading details...</p>;
  }

  return (
    <>
      <TopBar />
      <div className="mt-15">
        <div className="flex">
          <div className="m-15 ml-25">
            <img
              src={`https://image.tmdb.org/t/p/w400/${details.profile_path}`}
              alt="person"
              className="rounded-[40px] w-86 "
            />
          </div>

          <h1 className="text-6xl left-135 top-45 absolute font-bold ">
            {" "}
            {details.name}
          </h1>
          {details.biography ? (
            <p className=" w-[50%] top-65 left-135 absolute text-[1.2rem] h-106 wrap-break-word overflow-clip text-gray-400">
              {details.biography}
            </p>
          ) : (
            <p></p>
          )}
        </div>
        <div className="justify-center w-full mt-20 flex">
          <div className="h-[0.5px] bg-amber-50 w-[95%]"></div>
        </div>
        {/* <div className="">works : </div> */}
        <div className="flex flex-wrap justify-center items-center mt-23">
          {finalArrayMovie.map((work) => (
            <MovieCard
              id={work.id}
              key={work.id}
              title={work.title}
              rating={work.vote_average}
              image={`https://image.tmdb.org/t/p/w500${work.poster_path}`}
              year={work.release_date ? work.release_date.split("-")[0] : "N/A"}
            />
          ))}
          {finalArrayTv.map((work) => (
            <TvCard
              id={work.id}
              key={work.id}
              title={work.name}
              rating={work.vote_average}
              image={`https://image.tmdb.org/t/p/w500${work.poster_path}`}
              year={
                work.first_air_date ? work.first_air_date.split("-")[0] : "N/A"
              }
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Person;
