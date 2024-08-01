import {
  getActiveOrdinalCollectionsKey,
  getInactiveOrdinalsKey,
  getOrdinalsByOrdinalsCollectionIdKey,
  toggleOrdinalCollectionStatus,
} from "@/api/ordinals.api";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import TipCommunityModal from "@/components/modals/TipCommunityModal";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import routes from "@/navigation/routes";
import { appStateStore } from "@/stores/appState.store";
import {
  GetOrdinalsByOrdinalsCollectionIdRes,
  OrdinalCollection,
} from "@/types/api/ordinals.types";
import { validateLightningAddress } from "@/utilities";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { useStore } from "zustand";
import OrdinalCard from "./OrdinalCard";
import { useInView } from "react-intersection-observer";
import EmptyDataComponent from "@/components/EmptyDataComponent";

interface Props {
  data:
    | InfiniteData<GetOrdinalsByOrdinalsCollectionIdRes | null, unknown>
    | undefined;
  collectionDetails?: OrdinalCollection;
  isFiltered?: boolean;
  userLightningAddress: string;
  isFetchingNextPage: boolean;
  onEndReached: () => void;
  isSearchLoading: boolean;
}

const pageValues = [
  "TIP COMMUNITY",
  "TIP USER",
  "ACTIVATE COLLECTION",
  "No ordinal found.",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const OrdinalsCollectionList = ({
  data: paginatedData,
  collectionDetails,
  isFiltered,
  userLightningAddress,
  isFetchingNextPage,
  onEndReached,
  isSearchLoading,
}: Props): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const { ref, inView } = useInView();

  if (inView) {
    onEndReached();
  }

  const toggleOrdinalCollectionStatusAPI = useMutation({
    mutationFn: toggleOrdinalCollectionStatus,
  });
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const isLoading = toggleOrdinalCollectionStatusAPI?.isPending;

  const handleEdit = async () => {
    if (!collectionDetails?.id)
      return appToast.Error("Invalid ordinal collection id.");

    const response = await toggleOrdinalCollectionStatusAPI.mutateAsync(
      collectionDetails?.id,
    );
    if (response.ok) {
      queryClient.invalidateQueries({
        queryKey: [getActiveOrdinalCollectionsKey],
      });
      queryClient.invalidateQueries({
        queryKey: [getInactiveOrdinalsKey],
      });
      queryClient.invalidateQueries({
        queryKey: [getOrdinalsByOrdinalsCollectionIdKey],
      });

      navigate(routes.ACTIVE_ORDINAL_COLLECTIONS_PAGE);
    } else handleApiErrors(response);
  };

  const { setActiveModal } = useStore(appStateStore);

  const ordinals = paginatedData?.pages?.[0]?.data?.ordinals;

  const handleTip = () => {
    if (!ordinals || ordinals?.length < 1)
      return appToast.Warning("No ordinals found.");

    if (!!userLightningAddress) {
      const error = validateLightningAddress({
        lightningAddress: userLightningAddress,
      });
      if (!!error?.error?.message) {
        return appToast.Warning(
          error?.error?.message ?? "Invalid lightning address",
        );
      }
    }

    setActiveModal({
      modalType: "EMPTY_MODAL",
      shouldBackgroundClose: true,
      emptyModalComponent: (
        <TipCommunityModal
          userLightningAddress={userLightningAddress}
          collectionId={collectionDetails?.id ?? ""}
          isUserTip={!!isFiltered}
        />
      ),
    });
  };

  return (
    <>
      {isSearchLoading ? (
        <div className="flex flex-col items-center justify-center gap-2 py-28 text-white">
          <SpinnerIcon className="animate-spin text-4xl md:text-5xl lg:text-6xl" />
        </div>
      ) : ordinals && ordinals.length < 1 ? (
        <EmptyDataComponent message={translatedValues?.["No ordinal found."]} />
      ) : (
        <ul className="grid grid-cols-2 gap-x-5 gap-y-7">
          {paginatedData?.pages?.map((page, index) => (
            <Fragment key={index}>
              {page?.data?.ordinals.map((ordinal, key) => (
                <OrdinalCard
                  collectionId={collectionDetails?.id ?? ""}
                  isFiltered={isFiltered}
                  ordinal={ordinal}
                  key={key}
                />
              ))}
            </Fragment>
          ))}

          <div ref={ref}>
            {isFetchingNextPage && (
              <SpinnerIcon className="pagination-loader" />
            )}
          </div>
        </ul>
      )}

      {collectionDetails?.isActive === false ? (
        <div className="bg-appBlue100 fixed  bottom-0 mx-auto w-[90%] max-w-[25rem] pb-4 pt-2 ">
          <button
            onClick={handleEdit}
            disabled={isLoading}
            type="button"
            className="app-button-secondary flex items-center justify-center gap-x-2"
          >
            <span>{translatedValues["ACTIVATE COLLECTION"]}</span>
            {isLoading && <SpinnerIcon className="animate-spin" />}
          </button>
        </div>
      ) : (
        <div className="bg-appBlue100 fixed  bottom-0 mx-auto w-[90%] max-w-[25rem] pb-4 pt-2 ">
          <button
            onClick={handleTip}
            type="button"
            className="app-button-secondary flex items-center justify-center gap-x-2"
          >
            <span>
              {isFiltered
                ? translatedValues?.["TIP USER"]
                : translatedValues?.["TIP COMMUNITY"]}
            </span>
            <Icon icon="fa:group" />

            {isLoading && <SpinnerIcon className="animate-spin" />}
          </button>
        </div>
      )}
    </>
  );
};

export default OrdinalsCollectionList;
