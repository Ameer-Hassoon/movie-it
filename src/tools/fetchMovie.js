const apiKey =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMTdiZGE3NDAwOGMyZTE1MmM0OGUwNmIwM2MxMjc2YSIsIm5iZiI6MTc1ODgyNTkwMy41MTAwMDAyLCJzdWIiOiI2OGQ1OGRhZjBlOTExMjNhOWY2OTZmNjQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.JerV6w_HRT42T_pjjn0cYn58_DkysWbXdT8HtYAgNlc";
const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;

async function fetchMovies(url) {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

export default fetchMovies;
