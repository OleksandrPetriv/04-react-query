import axios from "axios";
import type { Movie } from "../movie";

interface FetchMoviesResponse {
  results: Movie[];
  total_pages: number;
}
async function fetchMovies(
  query: string,
  page: number,
): Promise<FetchMoviesResponse> {
  const response = await axios.get<FetchMoviesResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query,
        page,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    },
  );
  return response.data;
}

export default fetchMovies;
