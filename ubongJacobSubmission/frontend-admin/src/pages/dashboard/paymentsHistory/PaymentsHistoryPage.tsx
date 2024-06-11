import { getAllTipGroups, getAllTipGroupsKey } from "@/api/ordinals.api";
import AppLoader from "@/components/AppLoader";
import DashboardTitle from "@/components/DashboardTitle";
import EmptyDataComponent from "@/components/EmptyDataComponent";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import { useInfiniteQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Fragment } from "react";
import { useInView } from "react-intersection-observer";
import CollectionHistoryCard from "./components/CollectionHistoryCard";
import UserHistoryCard from "./components/UserHistoryCard";

const pageValues = ["No tip history found"] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const PaymentsHistoryPage = (): JSX.Element => {
  // const [isVisible, setVisibility] = useState(false);
  // const [activeMenu, setActiveMenu] = useState("SATs");
  const { ref, inView } = useInView();
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });

  // const handleBlur = () => {
  //   setTimeout(() => {
  //     setVisibility(false);
  //   }, 300);
  // };

  const {
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isFetchingNextPage,
    data,
  } = useInfiniteQuery({
    initialPageParam: "",
    queryKey: [getAllTipGroupsKey],
    queryFn: ({ pageParam }) => getAllTipGroups({ cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage?.metadata?.cursor?.afterCursor,
  });

  if (inView && hasNextPage && !isFetching) {
    fetchNextPage();
  }

  const firstData = data?.pages?.[0]?.data;

  return (
    <main className="app-page">
      <section
        onClick={(e) => e.stopPropagation()}
        // className="mx-auto flex h-full min-h-screen w-full max-w-[25rem] flex-col pb-20 text-white md:min-h-max  "
        className="mx-auto flex h-full min-h-screen w-full max-w-[25rem] flex-col pb-20 text-white"
      >
        <div className="sticky top-0 z-20 bg-appBlue100  pt-12 ">
          <DashboardTitle
            title={"Details"}
            // rightIcon={
            //   <FilterButton
            //     setActiveMenu={(value) => console.log(value)}
            //     handleBlur={handleBlur}
            //     isVisible={isVisible}
            //     setVisibility={() => setVisibility((value) => !value)}
            //   />
            // }
          />
        </div>

        {isLoading ? (
          <AppLoader />
        ) : !!firstData && firstData?.length < 1 ? (
          <EmptyDataComponent
            message={translatedValues?.["No tip history found"]}
          />
        ) : (
          <>
            <ul className="flex flex-col gap-y-2 pt-10">
              {data?.pages?.map((page, index) => (
                <Fragment key={index}>
                  {page?.data?.map((data, key) => (
                    <Fragment key={key}>
                      {data?.type === "group_tip" ? (
                        <CollectionHistoryCard
                          collectionNumber={data?.ordinalCollection?.numericId}
                          date={dayjs(data?.createdAt).format("MMM DD,YYYY")}
                          id={data?.id}
                          total={data?.totalTip}
                          totalSent={data?.totalTip}
                        />
                      ) : (
                        <UserHistoryCard
                          date={dayjs(data?.createdAt).format(
                            "MMM DD,YYYY HH:mm",
                          )}
                          totalSent={data?.totalTip}
                          address={data?.singleTip?.lightningAddress}
                        />
                      )}
                    </Fragment>
                  ))}
                </Fragment>
              ))}
            </ul>
            <div ref={ref}>
              {isFetchingNextPage && (
                <SpinnerIcon className="pagination-loader" />
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default PaymentsHistoryPage;
