import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { media, queryClient } from "src/api";
import { fetchViews } from "src/api/movies";
import type { MovieListResult } from "src/types";
import type { View } from "src/views";
import styles from "./results-page.module.css";

type ResultsPageProps = {
  view: View;
  page: string;
};
export function ResultsPage({ view, page }: ResultsPageProps) {
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    {
      queryKey: [view.endpoint, page],
      initialPageParam: 1,
      queryFn: ({ pageParam }) => fetchViews(view, pageParam.toString()),
      getNextPageParam: (lastPage: { next_page?: number }) =>
        lastPage.next_page,
    },
    queryClient
  );

  const movies = data?.pages.flatMap(({ movies }) => movies) ?? [];

  const viewport = useRef<HTMLDivElement>(null!);
  const results = useRef<HTMLDivElement>(null!);
  const lastFetch = useRef(0);

  const [itemWidth, setItemWidth] = useState(0);
  const [itemHeight, setItemHeight] = useState(0);
  const [numCols, setNumCols] = useState(4);
  const [lo, setLo] = useState(0);
  const [hi, setHi] = useState(movies.length || 12);
  const [pt, setPt] = useState(0);
  const [pb, setPb] = useState(0);

  const handleScroll = useCallback(() => {
    if (!viewport.current) return;
    if (isFetchingNextPage) return;

    const remaining =
      (viewport.current.scrollHeight -
        (viewport.current.scrollTop + viewport.current.clientHeight)) /
      itemHeight;

    if (remaining < 0.05) {
      if (Date.now() - lastFetch.current < 1000) return;
      fetchNextPage();
      lastFetch.current = Date.now();
    }

    const newLo = Math.floor(viewport.current.scrollTop / itemHeight) * numCols;
    const newHi =
      Math.ceil(
        (viewport.current.scrollTop + viewport.current.clientHeight) /
          itemHeight
      ) * numCols;

    setLo(() => newLo);
    setHi(() => newHi);

    setPt(Math.floor(newLo / numCols) * itemHeight);
    setPb(Math.floor((movies.length - newHi) / numCols) * itemHeight);
  }, [itemHeight, numCols, movies.length]);

  const handleResize = useCallback(() => {
    if (!results.current?.firstElementChild) return;

    const first = results.current.firstElementChild as HTMLAnchorElement;
    setItemWidth(first.offsetWidth);
    setItemHeight(first.offsetHeight);
    setNumCols(4);

    handleScroll();
  }, [handleScroll]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  //   if (!isSuccess) return <p>Loading...</p>;

  return (
    <div ref={viewport} className={styles.viewport} onScroll={handleScroll}>
      <div
        ref={results}
        className={styles.results}
        style={{ paddingTop: `${pt}px`, paddingBottom: `${pb}px` }}
      >
        {movies.slice(lo, hi).map((movie) => (
          <a key={movie.id} href={`/movie/${movie.id}`}>
            <img src={media(movie.poster_path, 500)} alt={movie.title} />
          </a>
        ))}
      </div>
    </div>
  );
}

type SearchResultPageProps = {
  movies: MovieListResult[];
};
export function SearchResultPage({ movies }: SearchResultPageProps) {
  return (
    <div className={styles.viewport}>
      <div className={styles.results}>
        {movies.map((movie) => (
          <a key={movie.id} href={`/movie/${movie.id}`}>
            <img src={media(movie.poster_path, 500)} alt={movie.title} />
          </a>
        ))}
      </div>
    </div>
  );
}
