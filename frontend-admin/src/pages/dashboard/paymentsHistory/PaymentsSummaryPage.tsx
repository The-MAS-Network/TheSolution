import { useNavigate } from "react-router-dom";
// import DataTable from "./components/DataTable";
// import Summary from "./components/Summary";
import routes from "@/navigation/routes";
import { useStore } from "zustand";
import { pageStateStore } from "@/stores/pageState.store";
import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getOrdinalTipsByGroupId } from "@/api/ordinals.api";
import DataTable from "./components/DataTable";
import Summary from "./components/Summary";
import AppSecondaryLoader from "@/components/AppSecondaryLoader";

const PaymentsSummaryPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { summaryPageState, setSummaryPageState } = useStore(pageStateStore);

  const clearPageState = () => {
    if (!!summaryPageState?.id) setSummaryPageState(null);
  };

  useEffect(() => {
    if (!summaryPageState?.id) {
      navigate(routes?.PAYMENTS_HISTORY_PAGE, { replace: true });
    }
    return () => clearPageState();
  }, [summaryPageState?.id]);

  const handleClose = () => {
    clearPageState();
    navigate(-1);
  };

  const handleView = () => {
    clearPageState();
    navigate(routes?.PAYMENTS_HISTORY_PAGE, { replace: true });
  };

  const id = summaryPageState?.id ?? "";

  const { isLoading, data } = useInfiniteQuery({
    initialPageParam: "",
    queryKey: ["getTipGroupSummary", id],
    queryFn: ({ pageParam }) =>
      getOrdinalTipsByGroupId({
        id,
        cursor: pageParam,
        size: 10,
      }),
    getNextPageParam: (lastPage) => lastPage?.metadata?.cursor?.afterCursor,
  });

  const totalTip = data?.pages[0]?.data?.ordinalTipsGroup?.totalTip ?? 0;
  const totalSent = data?.pages[0]?.data?.ordinalTipsGroup?.totalSent ?? 0;

  if (isLoading) return <AppSecondaryLoader />;

  return (
    <main className="app-page">
      <section
        onClick={(e) => e.stopPropagation()}
        className="mx-auto flex h-full min-h-screen w-full max-w-[25rem] flex-col pb-20 text-white md:min-h-max  "
      >
        <div className="flex w-full flex-col pt-12">
          <Summary totalAmount={totalTip} totalSentAmount={totalSent} />

          <div className="flex flex-col rounded-2xl bg-appBlue140 px-3 py-4 md:px-4 md:py-5">
            <DataTable data={data} />
          </div>
        </div>

        <button
          onClick={handleView}
          type="button"
          className="mb-6 mt-4 w-full rounded-2xl border border-appLight100 p-3 font-baloo2 font-semibold transition-all duration-300 hover:scale-105 active:scale-95 sm:p-4"
        >
          VIEW ALL
        </button>
        <button
          onClick={handleClose}
          type="button"
          className="w-full rounded-2xl border border-appBlue130 bg-appBlue130 p-3 font-baloo2 font-semibold transition-all duration-300 hover:scale-105 active:scale-95 sm:p-4"
        >
          CLOSE
        </button>
      </section>
    </main>
  );
};

export default PaymentsSummaryPage;
