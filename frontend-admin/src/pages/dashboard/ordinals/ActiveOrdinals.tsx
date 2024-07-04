import {
  getActiveOrdinalCollectionsKey,
  getOrdinalCollections,
} from "@/api/ordinals.api";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import { useInView } from "react-intersection-observer";
import EmptyCollectionComponent from "./components/EmptyCollectionComponent";
import OrdinalCollectionCard from "./components/OrdinalCollectionCard";

const ActiveOrdinals = (): JSX.Element => {
  const { ref, inView } = useInView();

  const { fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, data } =
    useInfiniteQuery({
      initialPageParam: "",
      queryKey: [getActiveOrdinalCollectionsKey],
      queryFn: ({ pageParam }) =>
        getOrdinalCollections({ status: "active", cursor: pageParam }),
      getNextPageParam: (lastPage) => lastPage?.metadata?.cursor?.afterCursor,
    });

  if (inView && hasNextPage && !isFetching) {
    fetchNextPage();
  }

  return (
    <>
      {!!data?.pages?.[0]?.data && data?.pages?.[0]?.data?.length > 0 ? (
        <>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-8">
            {data?.pages?.map((page, index) => (
              <Fragment key={index}>
                {page?.data?.map((collection, key) => (
                  <OrdinalCollectionCard collection={collection} key={key} />
                ))}
              </Fragment>
            ))}
            <div ref={ref}>
              {isFetchingNextPage && (
                <SpinnerIcon className="pagination-loader" />
              )}
            </div>
          </ul>
        </>
      ) : (
        <EmptyCollectionComponent />
      )}
    </>
  );
};

export default ActiveOrdinals;
