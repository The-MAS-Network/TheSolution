import {
  getActiveOrdinalCollectionsKey,
  getInactiveOrdinalsKey,
  getOrdinalsByOrdinalsCollectionIdKey,
  toggleOrdinalCollectionStatus,
} from "@/api/ordinals.api";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import { appStateStore } from "@/stores/appState.store";
import { OrdinalCollection } from "@/types/api/ordinals.types";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "zustand";

interface Props {
  ordinalCollection: OrdinalCollection;
}

const pageValues = [
  "all ordinals inside this collection will become inactive?",
  "Are you sure you want to deactivate",
  "No, Cancel",
  "Yes, Confirm",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const DeactivateOrdinalCollectionCard = ({
  ordinalCollection,
}: Props): JSX.Element => {
  const { closeActiveModal, setIsQuickActionEdit } = useStore(appStateStore);
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const queryClient = useQueryClient();

  const toggleOrdinalCollectionStatusAPI = useMutation({
    mutationFn: toggleOrdinalCollectionStatus,
  });

  const isLoading = toggleOrdinalCollectionStatusAPI.isPending;

  const handleEdit = async () => {
    if (!ordinalCollection?.id)
      return appToast.Error("Invalid ordinal collection id.");

    const response = await toggleOrdinalCollectionStatusAPI.mutateAsync(
      ordinalCollection?.id,
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

      setIsQuickActionEdit(false);
      appToast.Success(
        response?.data?.message ?? "Ordinal status changed successfully.",
      );
      closeActiveModal();
    } else handleApiErrors(response);
  };

  return (
    <div
      className={`flex w-full  flex-col items-center justify-center rounded-3xl bg-appDarkBlue600 px-12 pb-7 pt-6 text-white ${true ? "aspect-square" : ""}`}
    >
      <p className="max-w-[15.875rem] text-center text-lg">
        {translatedValues?.["Are you sure you want to deactivate"]}{" "}
        {`Collection ${ordinalCollection?.numericId}`} {"  "}{" "}
        {
          translatedValues?.[
            "all ordinals inside this collection will become inactive?"
          ]
        }
      </p>

      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          disabled={isLoading}
          onClick={closeActiveModal}
          className="flex items-center justify-center gap-2 rounded-full border border-white px-4 py-2 text-base font-medium text-white transition-all duration-300  hover:border-appDarkBlue100 hover:bg-white hover:text-appDarkBlue100 disabled:hidden sm:text-lg"
          type="button"
        >
          {translatedValues?.["No, Cancel"]}
        </button>
        <button
          disabled={isLoading}
          onClick={handleEdit}
          className="flex items-center justify-center  gap-2 rounded-full border border-appRed100 px-4 py-2 text-base font-medium text-appRed100 transition-all duration-300 hover:border-red-500  hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg"
          type="button"
        >
          {translatedValues?.["Yes, Confirm"]}{" "}
          {isLoading && <SpinnerIcon className="animate-spin" />}
        </button>
      </div>
    </div>
  );
};

export default DeactivateOrdinalCollectionCard;
