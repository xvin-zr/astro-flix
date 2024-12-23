import api from ".";
import type { MovieDetails, MovieList } from "../types";
import type { View } from "../views";

export async function fetchHomePage() {
  const [trending, now_playing, upcoming] = await Promise.all([
    api.get<MovieList>(fetch, "trending/movie/day"),
    api.get<MovieList>(fetch, "movie/now_playing"),
    api.get<MovieList>(fetch, "movie/upcoming"),
  ]);

  const _featured = trending.results[0];
  const featured = await api.get<MovieDetails>(fetch, `movie/${_featured.id}`, {
    append_to_response: "images",
  });

  return {
    featured,
    now_playing,
    upcoming,
    trending,
  };
}

export async function fetchViews(view: View, page: string) {
  const data = await api.get<MovieList>(fetch, view.endpoint, {
    page: page,
  });
  return {
    movies: data.results,
    next_page: data.page < data.total_pages ? data.page + 1 : undefined,
  };
}

export async function fetchSearchMovie(query: string) {
  if (query === "")
    return {
      query,
      movies: [],
    };

  const data = await api.get<MovieList>(fetch, "search/movie", {
    query,
  });
  return {
    movies: data.results,
    query,
  };
}

export async function fetchMovieDetails(id: number) {
  const movie = await api.get<MovieDetails>(fetch, `movie/${id}`, {
    append_to_response: "images,videos,recommendations",
  });

  const trailer = movie.videos.results.find(
    (video) =>
      video.official &&
      video.site === "YouTube" &&
      (video.type === "Trailer" || video.type === "Teaser")
  );

  return { movie, trailer };
}
