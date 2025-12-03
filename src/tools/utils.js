export class Tools {
  type = "";
  constructor(type) {
    this.type = type;
  }
  apiKey =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMTdiZGE3NDAwOGMyZTE1MmM0OGUwNmIwM2MxMjc2YSIsIm5iZiI6MTc1ODgyNTkwMy41MTAwMDAyLCJzdWIiOiI2OGQ1OGRhZjBlOTExMjNhOWY2OTZmNjQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.JerV6w_HRT42T_pjjn0cYn58_DkysWbXdT8HtYAgNlc";
  async fetchMovies(url) {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }
  starRating(num) {
    return `⭐ ${(num / 2).toFixed(1)}/5 `;
  }
  async fetchSearch(query) {
    switch (this.type) {
      case "movies":
        if (query.trim() === "") {
          const url = "https://api.themoviedb.org/3/movie/popular";
          const data = await this.fetchMovies(url);
          return data.results || [];
        } else {
          const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            query
          )}`;
          const data = await this.fetchMovies(url);
          return data.results || [];
        }
      case "shows":
        if (query.trim() === "") {
          const url = "https://api.themoviedb.org/3/tv/popular";
          const data = await this.fetchMovies(url);
          return data.results || [];
        } else {
          const url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
            query
          )}`;
          const data = await this.fetchMovies(url);
          return data.results || [];
        }

      case "people":
        if (query.trim() === "") {
          const url = `https://api.themoviedb.org/3/person/popular`;
          const data = await this.fetchMovies(url);
          return data.results || [];
        } else {
          const url = `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(
            query
          )}`;
          const data = await this.fetchMovies(url);
          return data.results || [];
        }
    }
  }
  releaseDate(data) {
    if (this.type === "movies") {
      return data.release_date ? data.release_date.split("-")[0] : "N/A";
    } else if (this.type === "shows") {
      return data.first_air_date ? data.first_air_date.split("-")[0] : "N/A";
    }
  }
}
