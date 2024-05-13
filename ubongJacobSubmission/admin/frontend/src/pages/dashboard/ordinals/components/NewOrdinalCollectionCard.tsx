import {
  createOrdinalCollection,
  getInactiveOrdinalsKey,
} from "@/api/ordinals.api";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import routes from "@/navigation/routes";
import { OrdinalsCollectionPageState } from "@/types";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const pageValues = ["Add New Collection"] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const NewOrdinalCollectionCard = (): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const createOrdinalCollectionAPI = useMutation({
    mutationFn: createOrdinalCollection,
  });

  const isLoading = createOrdinalCollectionAPI?.isPending;

  const handleAddCollection = async () => {
    if (!!isLoading) return;
    const response = await createOrdinalCollectionAPI.mutateAsync();

    if (response.ok && response?.data) {
      queryClient.invalidateQueries({ queryKey: [getInactiveOrdinalsKey] });
      appToast.Success(
        response?.data?.message ?? "Collection added successfully.",
      );
      navigate(routes.ORDINAL_COLLECTION_PAGE(response?.data?.data?.id), {
        state: {
          collectionIndex: response?.data?.data?.numericId,
        } as OrdinalsCollectionPageState,
      });
    } else handleApiErrors(response);
  };

  return (
    <li
      onClick={handleAddCollection}
      className="relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-y-3 rounded-2xl border-[2px] border-white bg-appBlue150 p-3 text-white transition-all duration-300  hover:scale-105 active:scale-95 md:p-4 lg:p-5"
    >
      <Icon className="text-2xl" icon="gridicons:add-outline" />

      <p className="text-sm font-semibold sm:text-base">
        {translatedValues?.["Add New Collection"]}
      </p>
    </li>
  );
};

export default NewOrdinalCollectionCard;
