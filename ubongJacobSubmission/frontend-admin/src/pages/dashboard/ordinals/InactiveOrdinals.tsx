import {
  getInactiveOrdinalsKey,
  getOrdinalCollections,
} from "@/api/ordinals.api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import { useInView } from "react-intersection-observer";
import NewOrdinalCollectionCard from "./components/NewOrdinalCollectionCard";
import OrdinalCollectionCard from "./components/OrdinalCollectionCard";
import SpinnerIcon from "@/components/icons/SpinnerIcon";

const InactiveOrdinals = (): JSX.Element => {
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, data } =
    useInfiniteQuery({
      initialPageParam: "",
      queryKey: [getInactiveOrdinalsKey],
      queryFn: ({ pageParam }) =>
        getOrdinalCollections({ status: "inactive", cursor: pageParam }),
      getNextPageParam: (lastPage) => lastPage?.metadata?.cursor?.afterCursor,
    });

  if (inView && hasNextPage && !isFetching) {
    fetchNextPage();
  }

  return (
    <>
      <ul className="mt-2 grid grid-cols-2 gap-x-5 gap-y-8">
        {data?.pages?.map((page, key) => (
          <Fragment key={key}>
            {page?.data?.map((collection, key) => (
              <OrdinalCollectionCard collection={collection} key={key} />
            ))}
          </Fragment>
        ))}

        <NewOrdinalCollectionCard />
        <div ref={ref}>
          {isFetchingNextPage && <SpinnerIcon className="pagination-loader" />}
        </div>
      </ul>
    </>
  );
};

export default InactiveOrdinals;
