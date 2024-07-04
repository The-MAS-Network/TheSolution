import { getLeaderboard } from "@/api/payments.api";
import ScrollProgress from "@/components/ScrollProgress";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import LeaderboardData from "./components/LeaderboardData";

const pageValues = ["ALL TIME TIPS", "No all time tip available."] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});
const AllTimeLeaderboardPage = (): JSX.Element => {
  const [scrollProgress, setScrollProgress] = useState(0);

  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });

  const { fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, data } =
    useInfiniteQuery({
      initialPageParam: "",
      queryKey: ["getAllTimeLeaderboard"],
      queryFn: ({ pageParam }) =>
        getLeaderboard({ cursor: pageParam, duration: "ALL_TIME" }),
      getNextPageParam: (lastPage) => lastPage?.metadata?.cursor?.afterCursor,
    });

  if (scrollProgress > 80 && hasNextPage && !isFetching) {
    fetchNextPage();
  }

  return (
    <section className="overflow-hidden  rounded-2xl bg-appDarkBlue700">
      {/* {timeLeft} */}
      <ScrollProgress
        onScrollProgress={(value) => setScrollProgress(value)}
        className=" h-full max-h-[73vh] overflow-y-auto p-4 md:p-5 lg:p-6"
      >
        <LeaderboardData
          title={translatedValues?.["ALL TIME TIPS"]}
          data={data}
          emptyDataMessage={translatedValues?.["No all time tip available."]}
        />

        <div>
          {isFetchingNextPage && <SpinnerIcon className="pagination-loader" />}
        </div>
      </ScrollProgress>
    </section>
  );
};

export default AllTimeLeaderboardPage;
