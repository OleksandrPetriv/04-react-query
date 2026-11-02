import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import fetchMovies from "../../services/movieService";
import type { Movie } from "../../types/Movie";
import css from "./App.module.css";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim() !== "",
  });

  function handleSearch(newQuery: string) {
    setQuery(newQuery);
    setPage(1);
  }

  function handleSelect(movie: Movie) {
    toast.success(movie.title);
  }

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  return (
    <>
      <Toaster position="top-right" />

      <SearchBar onSubmit={handleSearch} />

      <main className={css.container}>
        {isLoading && <p>Loading movies...</p>}

        {isError && (
          <p>Something went wrong. Please try again.</p>
        )}

        {!isLoading && !isError && query && movies.length === 0 && (
          <p>No movies found for your request.</p>
        )}

        {movies.length > 0 && (
          <MovieGrid
            movies={movies}
            onSelect={handleSelect}
          />
              )}
      {totalPages > 1 && (
  
  <ReactPaginate
    pageCount={totalPages}
    pageRangeDisplayed={5}
    marginPagesDisplayed={1}
    onPageChange={({ selected }) => setPage(selected + 1)}
    forcePage={page - 1}
    containerClassName={css.pagination}
    activeClassName={css.active}
    nextLabel="→"
    previousLabel="←"
  />
              )}   
      </main>
    </>
  );
}

export default App;