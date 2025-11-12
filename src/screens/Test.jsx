import React, { useState, useEffect } from "react";
import fetchMovies from "../tools/fetchMovie";

const Test = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ageRating, setAgeRating] = useState(null);
  const [err, setErr] = useState("");
  const [trailerURL, setTrailerURL] = useState("");
  const [crew, setCrew] = useState([]);
  const [cast, setCast] = useState([]);

  const id = 71912;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setErr("");

        const detailsUrl = `https://api.themoviedb.org/3/movie/${id}`;
        const movieData = await fetchMovies(detailsUrl);
        setMovie(movieData);

        const ratingUrl = `https://api.themoviedb.org/3/movie/${id}/release_dates`;
        const ratingData = await fetchMovies(ratingUrl);

        // Fixed: Safe access with optional chaining
        const krData = ratingData.results?.find((r) => r.iso_3166_1 === "KR");
        setAgeRating(krData?.release_dates?.[0]?.certification || "N/A");

        const trailerUrl = `https://api.themoviedb.org/3/movie/${id}/videos`;
        const trailerData = await fetchMovies(trailerUrl);

        // Fixed: Safe access with optional chaining
        const trailer = trailerData.results?.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );

        setTrailerURL(
          trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : ""
        );

        const crewUrl = `https://api.themoviedb.org/3/movie/${id}/credits`;
        const data = await fetchMovies(crewUrl);
        setCrew(data.crew || []);
        setCast(data.cast || []);
      } catch (error) {
        setErr(error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  // Show loading state
  if (loading) {
    return <div className="flex justify-center items-center">Loading...</div>;
  }

  // Show error state
  if (err) {
    return <div className="text-red-500">Error: {err}</div>;
  }

  // Show if no movie data
  if (!movie) {
    return <div>No movie data found.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{movie.title}</h1>

      {/* Option 1: YouTube Trailer */}
      {trailerURL && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Official Trailer</h2>
          <iframe
            width="600"
            height="338"
            src={`https://www.youtube.com/embed/${trailerURL.split("v=")[1]}`}
            title={`${movie.title} Trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-[600px] h-[338px]"
          ></iframe>
        </div>
      )}

      {/* Option 2: VidSrc Embed (using iframe) */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Watch Movie</h2>
        <iframe
          src={`https://vidsrc.to/embed/movie/${movie.id}`}
          width="600"
          height="400"
          frameBorder="0"
          allowFullScreen
          className="w-[600px] h-[400px]"
          title={`${movie.title} Movie`}
        ></iframe>
      </div>

      {/* Option 3: Show movie details */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Movie Details</h2>
        <p>
          <strong>Overview:</strong> {movie.overview}
        </p>
        <p>
          <strong>Release Date:</strong> {movie.release_date}
        </p>
        <p>
          <strong>Rating:</strong> {movie.vote_average}/10
        </p>
        <p>
          <strong>Age Rating:</strong> {ageRating}
        </p>

        <div className="mt-4">
          <h3 className="text-lg font-semibold">Top Cast</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {/* Fixed: Safe array mapping */}
            {cast.slice(0, 5).map((person) => (
              <span key={person.id} className="bg-gray-200 px-2 py-1 rounded">
                {person.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
