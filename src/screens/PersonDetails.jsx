import React, { useEffect, useState } from "react";
import { TopBar } from "../components/TopBar";
// import fetchMovies from "../tools/fetchMovie";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import { Tools } from "../tools/utils";

const PersonDetails = () => {
  const tools = new Tools();
  const movieTools = new Tools("movies");
  const showTools = new Tools("shows");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({});
  const [movieCast, setMovieCast] = useState([]);
  // const [movieCrew, setMovieCrew] = useState([]);
  // const [tvCrew, setTvCrew] = useState([]);
  const [tvCast, setTvCast] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const castDetails = async () => {
      try {
        setLoading(true);

        const personUrl = `https://api.themoviedb.org/3/person/${id}`;
        const personData = await tools.fetchMovies(personUrl);
        setDetails(personData);

        const worksUrl = `https://api.themoviedb.org/3/person/${id}/movie_credits`;
        const worksData = await tools.fetchMovies(worksUrl);
        setMovieCast(worksData.cast || []);
        // setMovieCrew(worksData.crew || []);

        const tvUrl = `https://api.themoviedb.org/3/person/${id}/tv_credits`;
        const tvData = await tools.fetchMovies(tvUrl);
        setTvCast(tvData.cast || []);
        // setTvCrew(tvData.crew || []);
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
  const combinedArrayMovie = [...movieCast];
  const notValuableArrayMovie = combinedArrayMovie.filter(
    (e) => e.poster_path > ""
  );
  const finalArrayMovie = notValuableArrayMovie.filter(
    (user, index, self) => index === self.findIndex((u) => u.id === user.id)
  );
  // *********************************the shows******************************
  const combinedArrayTv = [...tvCast];
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
          <div className="m-15 ml-25 h-128">
            <img
              src={`https://image.tmdb.org/t/p/w400/${details.profile_path}`}
              alt="person"
              className="rounded-[20px] w-86 "
            />
          </div>

          <h1 className="text-6xl left-135 top-45 absolute font-bold ">
            {" "}
            {details.name}
          </h1>
          {details.biography ? (
            <p className=" w-[50%] top-65 left-135 absolute text-[1.2rem] h-106 wrap-break-word overflow-clip ">
              {details.biography}
            </p>
          ) : (
            <p></p>
          )}
        </div>
        <div className="justify-center w-full mt-20 flex">
          <div className="h-[0.5px] bg-gray-300 w-[95%]"></div>
        </div>
        <div className="flex flex-wrap justify-center items-center mt-23">
          {finalArrayMovie.map((work) => (
            <Card
              id={work.id}
              key={work.id}
              title={work.title}
              rating={work.vote_average}
              image={`https://image.tmdb.org/t/p/w500${work.poster_path}`}
              year={movieTools.releaseDate(work)}
              type="movie"
            />
          ))}
          {finalArrayTv.map((work) => (
            <Card
              id={work.id}
              key={work.id}
              title={work.name}
              rating={work.vote_average}
              image={`https://image.tmdb.org/t/p/w500${work.poster_path}`}
              year={showTools.releaseDate(work)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default PersonDetails;
