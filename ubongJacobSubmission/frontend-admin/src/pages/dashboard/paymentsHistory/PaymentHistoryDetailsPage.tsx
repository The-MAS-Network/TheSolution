import { getOrdinalTipsByGroupId } from "@/api/ordinals.api";
import DashboardTitle from "@/components/DashboardTitle";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import DataTable from "./components/DataTable";
import Summary from "./components/Summary";
import { useParams } from "react-router-dom";

const PaymentHistoryDetailsPage = (): JSX.Element => {
  const { ref, inView } = useInView();
  const id = useParams()?.id ?? "";

  const { fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, data } =
    useInfiniteQuery({
      initialPageParam: "",
      queryKey: ["getAllTipGroups", id],
      queryFn: ({ pageParam }) =>
        getOrdinalTipsByGroupId({
          id,
          cursor: pageParam,
        }),
      getNextPageParam: (lastPage) => lastPage?.metadata?.cursor?.afterCursor,
    });

  if (inView && hasNextPage && !isFetching) {
    fetchNextPage();
  }

  const totalTIp = data?.pages[0]?.data?.ordinalTipsGroup?.totalTip ?? 0;

  return (
    <main className="app-page">
      <section
        onClick={(e) => e.stopPropagation()}
        // className="mx-auto flex h-full min-h-screen w-full max-w-[25rem] flex-col pb-20 text-white md:min-h-max  "
        className="mx-auto flex h-full min-h-screen w-full max-w-[25rem] flex-col pb-20 text-white"
      >
        <div className="sticky top-0 z-20 bg-appBlue100  pt-12 ">
          <DashboardTitle title={"Payment Details"} />
        </div>

        <div className="mt-10 flex flex-col rounded-2xl bg-appBlue140 px-3 py-4 md:px-4 md:py-5">
          <Summary totalAmount={totalTIp} totalSentAmount={totalTIp} />

          <DataTable data={data} />
          <div ref={ref}>
            {isFetchingNextPage && (
              <SpinnerIcon className="pagination-loader" />
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default PaymentHistoryDetailsPage;
