import {
  deleteOrdinalCollection,
  getInactiveOrdinalsKey,
  getTotalOrdinalsInACollection,
} from "@/api/ordinals.api";
import OrdinalIcon from "@/components/icons/OrdinalIcon";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import routes from "@/navigation/routes";
import { appStateStore } from "@/stores/appState.store";
import { OrdinalCollection } from "@/types/api/ordinals.types";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { Icon } from "@iconify/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";

interface Props {
  collection: OrdinalCollection;
}

const pageValues = [
  "all ordinals inside this collection will be lost?",
  "Are you sure you want to delete",
  "No, Cancel",
  "Yes, Delete",
  "No. Of ordinals",
  "Delete Collection",
  "Collection",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const DeleteCollectionCard = ({ collection }: Props): JSX.Element => {
  const [isConfirm, setIsConfirm] = useState(false);
  const { closeActiveModal } = useStore(appStateStore);
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["getTotalOrdinalsInACollection", collection.id],
    queryFn: async () => {
      const response = await getTotalOrdinalsInACollection(collection.id);
      if (response.ok) {
        return response?.data?.data;
      } else {
        handleApiErrors(response);
        return null;
      }
    },
  });

  const deleteOrdinalCollectionAPI = useMutation({
    mutationFn: deleteOrdinalCollection,
  });

  const isLoading = deleteOrdinalCollectionAPI?.isPending;

  const handleDeleteCollection = async () => {
    const response = await deleteOrdinalCollectionAPI.mutateAsync(
      collection?.id,
    );

    if (response.ok) {
      queryClient.invalidateQueries({ queryKey: [getInactiveOrdinalsKey] });
      appToast.Success(
        response?.data?.message ?? "Collection deleted successfully.",
      );
      navigate(routes.INACTIVE_ORDINAL_COLLECTIONS_PAGE, { replace: true });

      closeActiveModal();
    } else handleApiErrors(response);
  };

  const collectionName =
    translatedValues.Collection + "  " + collection?.numericId;

  return (
    <div
      className={`flex w-full  flex-col items-center justify-center rounded-3xl bg-appDarkBlue600 px-12 pb-7 pt-6 text-white ${!isConfirm ? "aspect-square" : ""}`}
    >
      {!isConfirm ? (
        <>
          <p className="mb-9 text-xl  font-normal text-appLight200 sm:text-2xl">
            {collectionName}
          </p>

          <span className="rounded-md bg-appDarkBlue400 p-2">
            <OrdinalIcon className="text-xl" />
          </span>

          <p className="pb-3 pt-4 text-base sm:text-lg">
            {translatedValues?.["No. Of ordinals"]}
          </p>

          <data className="mb-7 text-lg font-medium md:text-xl lg:text-2xl">
            {data}
          </data>

          <button
            type="button"
            onClick={() => setIsConfirm(true)}
            className="flex items-center justify-center gap-2 rounded-full border border-appRed100 px-9 py-1 text-base font-medium text-appRed100 transition-all  duration-300 hover:border-red-500 hover:bg-red-500 hover:text-white sm:text-lg"
          >
            {translatedValues?.["Delete Collection"]}
            <Icon className="text-xl" icon="material-symbols:delete-outline" />
          </button>
        </>
      ) : (
        <>
          <p className="max-w-[15.875rem] text-center text-lg">
            {translatedValues?.["Are you sure you want to delete"]}{" "}
            {collectionName} {"  "}{" "}
            {
              translatedValues?.[
                "all ordinals inside this collection will be lost?"
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
              onClick={handleDeleteCollection}
              className="flex items-center justify-center  gap-2 rounded-full border border-appRed100 px-4 py-2 text-base font-medium text-appRed100 transition-all duration-300 hover:border-red-500  hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg"
              type="button"
            >
              {translatedValues?.["Yes, Delete"]}{" "}
              {isLoading && <SpinnerIcon className="animate-spin" />}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DeleteCollectionCard;
