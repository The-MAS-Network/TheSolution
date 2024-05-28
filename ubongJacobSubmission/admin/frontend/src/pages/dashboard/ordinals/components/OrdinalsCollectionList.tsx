import {
  toggleOrdinalCollectionStatus,
  getActiveOrdinalCollectionsKey,
  getInactiveOrdinalsKey,
  getOrdinalsByOrdinalsCollectionIdKey,
} from "@/api/ordinals.api";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import OrdinalCard from "./OrdinalCard";
import {
  GetOrdinalsByOrdinalsCollectionIdRes,
  OrdinalCollection,
} from "@/types/api/ordinals.types";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useNavigate } from "react-router-dom";
import routes from "@/navigation/routes";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import { useStore } from "zustand";
import { appStateStore } from "@/stores/appState.store";
import TipCommunityModal from "@/components/modals/TipCommunityModal";

interface Props {
  data: GetOrdinalsByOrdinalsCollectionIdRes;
  collectionDetails?: OrdinalCollection;
}

const pageValues = ["TIP COMMUNITY", "ACTIVATE COLLECTION"] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const OrdinalsCollectionList = ({
  data,
  collectionDetails,
}: Props): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });

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

  const handleTip = () => {
    setActiveModal({
      modalType: "Type one",
      shouldBackgroundClose: true,
      modalOneComponent: <TipCommunityModal />,
    });
  };

  return (
    <>
      <ul className="grid grid-cols-2 gap-x-5 gap-y-7">
        {data.data?.map((ordinal, index) => (
          <OrdinalCard ordinal={ordinal} key={index} />
        ))}
      </ul>

      {collectionDetails?.isActive === false ? (
        <div className="fixed bottom-0  mx-auto w-[90%] max-w-[25rem] bg-appBlue100 pb-4 pt-2 ">
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
        <div className="fixed bottom-0  mx-auto w-[90%] max-w-[25rem] bg-appBlue100 pb-4 pt-2 ">
          <button
            onClick={handleTip}
            type="button"
            className="app-button-secondary flex items-center justify-center gap-x-2"
          >
            <span>{translatedValues?.["TIP COMMUNITY"]}</span>
            <Icon icon="fa:group" />

            {isLoading && <SpinnerIcon className="animate-spin" />}
          </button>
        </div>
      )}
    </>
  );
};

export default OrdinalsCollectionList;
