import {
  getOrdinalsByOrdinalsCollectionId,
  getOrdinalsByOrdinalsCollectionIdKey,
  getSingleOrdinalDataKey,
} from "@/api/ordinals.api";
import AppErrorComponent from "@/components/AppErrorComponent";
import AppLoader from "@/components/AppLoader";
import AppSearchInput from "@/components/AppSearchInput";
import DashboardTitle from "@/components/DashboardTitle";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import useDebounce from "@/hooks/useDebouncer";
import { appStateStore } from "@/stores/appState.store";
import {
  ILocationParams,
  OrdinalsCollectionPageState,
  QuickActionOption,
} from "@/types";
import { pasteFromClipboard } from "@/utilities";
import { appToast } from "@/utilities/appToast";
import { handleApiErrors } from "@/utilities/handleErrors";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useStore } from "zustand";
import DeleteCollectionCard from "./components/DeleteCollectionCard";
import EmptySearchComponent from "./components/EmptySearchComponent";
import NewOrdinalList from "./components/NewOrdinalList";
import OrdinalsCollectionList from "./components/OrdinalsCollectionList";
import QuickActions from "./components/QuickActions";

const pageValues = [
  "Inscription, address, ID",
  "PASTE",
  "Search inscription, address, ID to add to collection",
  "The ordinals in the collection with the given id could not be found.",
  "ACTIVATE COLLECTION",
  "Lightning Address",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const OrdinalsCollectionPage = (): JSX.Element => {
  const [searchValue, setSearchValue] = useState("");
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });
  const paramID = useParams()?.id;
  const queryClient = useQueryClient();
  const {
    setActiveQuickAction,
    setIsQuickActionEdit,
    activeQuickAction,
    isQuickActionEdit,
    setActiveModal,
    addordinalIdInCollection,
    clearOrdinalIdsInCollection,
  } = useStore(appStateStore);

  const handlePaste = async () => {
    const clipboardValue = await pasteFromClipboard();
    setSearchValue(clipboardValue);
  };

  const debouncedValue = useDebounce(searchValue, 1000);

  const { data, isLoading } = useQuery({
    queryKey: [getOrdinalsByOrdinalsCollectionIdKey, paramID],
    queryFn: async () => {
      if (!paramID) return null;
      const response = await getOrdinalsByOrdinalsCollectionId(paramID);
      if (response.ok) {
        return response?.data;
      } else {
        handleApiErrors(response);
        return null;
      }
    },
  });

  useEffect(() => {
    if (!!data && data?.data?.length > 0) {
      data.data.forEach((value) => {
        addordinalIdInCollection(value?.ordinalNumber?.toString());
      });
    }

    return () => {
      clearOrdinalIdsInCollection();
    };
  }, [data]);

  useEffect(() => {
    if (debouncedValue.length < 3 && debouncedValue.length > 0)
      appToast.Warning("Search value must be greater than 3 characters");
  }, [debouncedValue]);

  const handleSearchClick = () => {
    if (debouncedValue.length > 3) {
      queryClient.invalidateQueries({
        queryKey: [getSingleOrdinalDataKey],
      });
    }
  };

  const ordinalsPageState =
    useLocation() as ILocationParams<OrdinalsCollectionPageState>;

  const collectionDetails = data?.data?.[0]?.ordinalCollection;

  const collectionIndex = ordinalsPageState?.state?.collectionIndex;

  const handleBodyClick = () => {
    if (!!activeQuickAction) setActiveQuickAction(null);
    if (!!isQuickActionEdit) setIsQuickActionEdit(false);
  };

  const handleDelete = () => {
    if (!collectionDetails)
      return appToast.Warning("Invalid ordinals collection details");
    setActiveModal({
      modalType: "Type one",
      shouldBackgroundClose: true,
      modalOneComponent: (
        <DeleteCollectionCard collection={collectionDetails} />
      ),
    });
  };

  const options: QuickActionOption[] = [
    {
      title: "Information",
      icon: "ph:info-duotone",
      onClick: () => null,
    },
    {
      title: "Modify",
      icon: "mingcute:edit-line",
      onClick: () => setIsQuickActionEdit(true),
    },
    {
      title: "Clear Collection",
      icon: "fluent:delete-32-regular",
      onClick: handleDelete,
    },
  ];

  if (isLoading) return <AppLoader />;

  return (
    <main
      onClick={handleBodyClick}
      className="app-container-lg  h-full  min-h-screen flex-col items-center justify-center md:flex "
    >
      <section
        onClick={(e) => e.stopPropagation()}
        className="mx-auto flex h-full min-h-screen w-full max-w-[25rem] flex-col pb-36 text-white md:min-h-max  "
      >
        <div className="sticky top-0 z-20 bg-appBlue100  pt-12 ">
          <DashboardTitle
            rightIcon={
              collectionDetails?.isActive === false ? (
                <QuickActions options={options} />
              ) : undefined
            }
            title={`${!!collectionIndex ? `Collection ${collectionIndex}` : !data ? "Collection not found." : data?.data?.length < 1 ? "Collection" : "Collection " + collectionDetails?.numericId}`}
          />

          {!!collectionDetails?.isActive ? (
            <AppSearchInput
              disabled
              onSearchClick={handleSearchClick}
              value={searchValue}
              onChange={(value) => setSearchValue(value?.currentTarget?.value)}
              placeholder={translatedValues["Lightning Address"]}
            />
          ) : (
            <AppSearchInput
              disabled={!data}
              onSearchClick={handleSearchClick}
              value={searchValue}
              onChange={(value) => setSearchValue(value?.currentTarget?.value)}
              placeholder={translatedValues["Inscription, address, ID"]}
            />
          )}
        </div>

        {debouncedValue.length > 3 ? (
          <NewOrdinalList
            onAddDone={() => setSearchValue("")}
            collectionId={paramID ?? ""}
            searchValue={debouncedValue}
          />
        ) : !data ? (
          <AppErrorComponent
            title={
              translatedValues[
                "The ordinals in the collection with the given id could not be found."
              ]
            }
          />
        ) : data?.data?.length < 1 ? (
          <EmptySearchComponent
            onPaste={handlePaste}
            action={translatedValues?.PASTE}
            title={
              translatedValues?.[
                "Search inscription, address, ID to add to collection"
              ]
            }
          />
        ) : (
          <OrdinalsCollectionList
            collectionDetails={collectionDetails}
            data={data}
          />
        )}
      </section>
    </main>
  );
};

export default OrdinalsCollectionPage;
