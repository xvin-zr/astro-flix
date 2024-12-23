import { useInfiniteQuery } from "@tanstack/react-query";
import { media, queryClient } from "src/api";
import { fetchViews } from "src/api/movies";
import type { View } from "src/views";

type ResultsPageProps = {
  view: View;
  page: string;
};
export function ResultsPage({ view, page }: ResultsPageProps) {
  const { data } = useInfiniteQuery(
    {
      queryKey: [view.endpoint, page],
      initialPageParam: 1,
      queryFn: () => fetchViews(view, page),
      getNextPageParam: (lastPage: { next_page?: number }) =>
        lastPage.next_page,
    },
    queryClient
  );

  return (
    <div className='results'>
      {data?.pages.map(({ movies }) => {
        return movies.map((movie) => (
          <a key={movie.id} href={`/movie/${movie.id}`}>
            <img src={media(movie.poster_path, 500)} alt={movie.title} />
          </a>
        ));
      })}
    </div>
  );
}
