import { useAppStateStore } from "@/stores/appState.store";

const CollectionStatsModal = (): JSX.Element => {
  const { closeActiveModal } = useAppStateStore();

  return (
    <div
      onClick={(e) => e?.stopPropagation()}
      className={`flex w-full  flex-col items-center justify-center rounded-3xl bg-appDarkBlue600 p-6 text-white ${true ? "aspect-square" : ""}`}
    >
      <dl className="flex w-full items-center justify-between pb-6 font-medium">
        <dt>Total Ordinals :</dt>
        <dt>55</dt>
      </dl>
      <dl className="flex w-full items-center justify-between gap-5 font-medium">
        <dt>Total Claimed Ordinals :</dt>
        <dt>50</dt>
      </dl>

      <button
        onClick={closeActiveModal}
        className="mt-7 flex items-center justify-center gap-2  rounded-full border border-appRed100 px-4 py-2 text-base font-bold text-appRed100 transition-all duration-300 hover:border-red-500  hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg"
        type="button"
      >
        <p>Close </p>
      </button>
    </div>
  );
};

export default CollectionStatsModal;
