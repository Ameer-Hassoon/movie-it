import { useParams } from "react-router-dom";
import { getTv } from "../api/tmdb.js";
import { useAsync } from "../hooks/useAsync.js";
import TitleDetails, { TitleDetailsSkeleton } from "../components/TitleDetails";
import { ErrorState } from "../components/States";

const TvDetails = () => {
  const { id } = useParams();
  const { data, loading, error } = useAsync((signal) => getTv(id, signal), [id]);

  if (error) return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  if (loading || !data) return <TitleDetailsSkeleton />;
  return <TitleDetails kind="tv" title={data} />;
};

export default TvDetails;
