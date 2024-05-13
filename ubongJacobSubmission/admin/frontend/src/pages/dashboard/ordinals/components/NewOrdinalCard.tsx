import { ordinalBaseApi } from "@/api/base.api";
import {
  addOrdinal,
  getOrdinalsByOrdinalsCollectionIdKey,
} from "@/api/ordinals.api";
import AppIframe from "@/components/AppIframe";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import { appStateStore } from "@/stores/appState.store";
import { SpecificInscriptionResponse } from "@/types/api/ordinals.types";
import {
  CheckOrdinalContentType,
  generateOrdinalContentLink,
  truncateText,
} from "@/utilities";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useStore } from "zustand";

interface Props {
  data: SpecificInscriptionResponse;
  collectionId: string;
}

const NewOrdinalCard = ({ data, collectionId }: Props): JSX.Element => {
  const contentType = CheckOrdinalContentType({
    content_type: data?.content_type ?? "",
    mime_type: data?.mime_type ?? "",
  });

  const { data: content, isLoading: isContentLoading } = useQuery({
    queryKey: ["getOrdinalContent", data?.id],
    queryFn: async () => {
      if (!data?.id || contentType == "HTML" || contentType == "Image")
        return null;

      const response = await ordinalBaseApi.get(`/${data?.id}`);
      if (response.ok) {
        return response?.data;
      } else {
        if (response.status === 404) return null;
        handleApiErrors(response);
        return null;
      }
    },
    enabled: !!data,
  });
  const { addordinalIdInCollection, ordinalIdsInCollection } =
    useStore(appStateStore);

  const queryClient = useQueryClient();

  const contentValue = () => {
    const value = JSON.stringify(content ?? "");

    if (contentType == "HTML" || contentType === "Image") {
      return generateOrdinalContentLink(data?.id ?? "");
    } else if (
      contentType == "Text" &&
      (value?.length < 1 || value?.length > 1900)
    ) {
      return value;
    } else {
      return undefined;
    }
  };

  const addOrdinalAPI = useMutation({ mutationFn: addOrdinal });

  const isAlreadyAdded = ordinalIdsInCollection.includes(
    data?.number?.toString(),
  );

  const handleAdd = async () => {
    if (isAlreadyAdded)
      return appToast.Info(
        "Ordinal already added to collection. Scroll down and click done to view all saved ordinals in this collection.",
      );
    if (!data?.id) return appToast.Error("Invalid ordinal id");
    if (!collectionId) return appToast.Error("Invalid ordinal collection id");

    const response = await addOrdinalAPI.mutateAsync({
      contentType: data?.content_type,
      mimeType: data?.mime_type,
      ordinalId: data?.id,
      ordinalNumber: data?.number?.toString(),
      ordinalCollectionId: collectionId,
      possibleOrdinalContent: contentValue(),
    });

    if (response?.ok) {
      addordinalIdInCollection(data?.number?.toString());
      queryClient.invalidateQueries({
        queryKey: [getOrdinalsByOrdinalsCollectionIdKey],
      });
      appToast.Success(
        response?.data?.message ?? "Ordinal added successfully.",
      );
    } else handleApiErrors(response);
  };

  return (
    <li className="flex flex-col">
      <div className="mb-2 w-full flex-1 overflow-auto rounded-lg bg-appBlue110 p-3 text-sm text-white">
        {contentType === "HTML" ? (
          <AppIframe src={generateOrdinalContentLink(data?.id)} />
        ) : contentType == "Image" ? (
          <img
            src={generateOrdinalContentLink(data?.id)}
            className="w-full"
            draggable={false}
          />
        ) : isContentLoading ? (
          <div className="flex aspect-square h-full w-full items-center justify-center">
            <Icon
              className="text-3xl md:text-4xl lg:text-5xl"
              icon="line-md:loading-twotone-loop"
            />
          </div>
        ) : (
          <p className="custom-break-words !line-clamp-[8] ">
            {truncateText(JSON.stringify(content))}
          </p>
        )}
      </div>
      <button
        onClick={handleAdd}
        disabled={addOrdinalAPI?.isPending}
        className={`flex w-full items-center justify-center rounded-full  py-2 text-sm font-medium  transition-all duration-300 active:scale-95 disabled:cursor-not-allowed sm:text-base ${isAlreadyAdded ? "bg-white/80 text-appDarkBlue100" : " bg-appDarkBlue100 text-white disabled:opacity-50"}`}
        type="button"
      >
        {addOrdinalAPI?.isPending ? (
          <SpinnerIcon className="animate-spin text-white" />
        ) : isAlreadyAdded ? (
          <span>Already in Collection</span>
        ) : (
          <span>Add to Collection</span>
        )}
      </button>
    </li>
  );
};

export default NewOrdinalCard;
