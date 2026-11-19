import { useParams } from "react-router-dom";
import { getMovie } from "../api/tmdb.js";
import { useAsync } from "../hooks/useAsync.js";
import TitleDetails, { TitleDetailsSkeleton } from "../components/TitleDetails";
import { ErrorState } from "../components/States";

const MovieDetails = () => {
  const { id } = useParams();
  const { data, loading, error } = useAsync((signal) => getMovie(id, signal), [id]);

  if (error) return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  if (loading || !data) return <TitleDetailsSkeleton />;
  return <TitleDetails kind="movie" title={data} />;
};

export default MovieDetails;
