import {
  getOrdinalsByOrdinalsCollectionId,
  getOrdinalsByOrdinalsCollectionIdKey,
  getOrdinalsInCollectionByLightningAddress,
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
import {
  GetOrdinalsByOrdinalsCollectionIdRes,
  Ordinal,
} from "@/types/api/ordinals.types";
import { pasteFromClipboard } from "@/utilities";
import { appToast } from "@/utilities/appToast";
import {
  InfiniteData,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
  "Clear Collection",
  "Modify",
  "Information",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const OrdinalsCollectionPage = (): JSX.Element => {
  const [searchValue, setSearchValue] = useState("");
  const [lightningSearchValue, setLightningSearchValue] = useState("");
  const [filteredOrdinals, setFilteredOrdinals] = useState<Ordinal[] | null>(
    null,
  );
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
  const debouncedLightningValue = useDebounce(lightningSearchValue, 1000);

  const {
    fetchNextPage,
    hasNextPage,
    isFetching,
    data: ordinalsByOrdinalsCollectionId,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    initialPageParam: "",
    queryKey: [getOrdinalsByOrdinalsCollectionIdKey, paramID],
    queryFn: ({ pageParam }) =>
      getOrdinalsByOrdinalsCollectionId({
        id: paramID ?? "",
        cursor: pageParam,
      }),
    getNextPageParam: (lastPage) => lastPage?.metadata?.cursor?.afterCursor,
  });

  const {
    data: content,
    refetch,
    isFetching: isContentLoading,
  } = useQuery({
    queryKey: [
      "getOrdinalsInCollectionByLightningAddress",
      debouncedLightningValue,
      paramID,
    ],
    queryFn: () =>
      getOrdinalsInCollectionByLightningAddress({
        collectionId: paramID ?? "",
        lightningAddress: debouncedLightningValue,
      }),
    enabled: false,
  });

  const isFiltered = debouncedLightningValue?.length > 1;

  useEffect(() => {
    if (
      !!ordinalsByOrdinalsCollectionId &&
      ordinalsByOrdinalsCollectionId?.pages?.length > 0
    ) {
      ordinalsByOrdinalsCollectionId.pages.forEach((value) => {
        value?.data?.ordinals?.forEach((secondValue) => {
          addordinalIdInCollection(secondValue?.ordinalId?.toString());
        });
      });
    }

    return () => {
      clearOrdinalIdsInCollection();
    };
  }, [ordinalsByOrdinalsCollectionId?.pages]);

  // useEffect(() => {
  //   if (debouncedValue.length < 3 && debouncedValue.length > 0)
  //     appToast.Warning("Search value must be greater than 3 characters");
  // }, [debouncedValue]);

  useEffect(() => {
    if (debouncedLightningValue.length < 2 && debouncedValue.length > 0) {
      appToast.Warning("Search value must be at least 2 characters");
    }

    if (debouncedLightningValue.length < 2) {
      if (filteredOrdinals) {
        setFilteredOrdinals(null);
      }
    } else {
      if (ordinalsByOrdinalsCollectionId?.pages) {
        ordinalsByOrdinalsCollectionId?.pages?.forEach((value) => {
          const ordinals = value?.data?.ordinals;
          ordinals;
          const filteredData = ordinals?.filter(({ user }) =>
            user?.lightningAddress?.includes(debouncedLightningValue),
          );

          if (filteredData && filteredData?.length > 0) {
            setFilteredOrdinals(filteredData);
          } else {
            refetch();
          }
        });
      }
    }
  }, [debouncedLightningValue]);

  const handleSearchClick = () => {
    if (debouncedValue.length > 3) {
      queryClient.invalidateQueries({
        queryKey: [getSingleOrdinalDataKey],
      });
    }
  };

  const ordinalsPageState =
    useLocation() as ILocationParams<OrdinalsCollectionPageState>;

  const collectionDetails =
    ordinalsByOrdinalsCollectionId?.pages?.[0]?.data?.ordinalsCollection;

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
      title: translatedValues?.Information,
      icon: "ph:info-duotone",
      onClick: () => null,
    },
    {
      title: translatedValues?.Modify,
      icon: "mingcute:edit-line",
      onClick: () => setIsQuickActionEdit(true),
    },
    {
      title: translatedValues?.["Clear Collection"],
      icon: "fluent:delete-32-regular",
      onClick: handleDelete,
    },
  ];

  if (isLoading) return <AppLoader />;

  const firstPageOrdinal =
    ordinalsByOrdinalsCollectionId?.pages?.[0]?.data?.ordinals;

  const getCurrentData = ():
    | InfiniteData<GetOrdinalsByOrdinalsCollectionIdRes | null, unknown>
    | undefined => {
    if (debouncedLightningValue.length < 2)
      return ordinalsByOrdinalsCollectionId;

    if (filteredOrdinals && filteredOrdinals?.length > 0)
      return {
        pageParams: ordinalsByOrdinalsCollectionId?.pageParams ?? [""],
        pages: [
          {
            status: true,
            data: {
              ordinalsCollection: { id: "", numericId: 1, isActive: false },
              ordinals: filteredOrdinals,
            },
          },
        ],
      };

    return {
      pageParams: ordinalsByOrdinalsCollectionId?.pageParams ?? [""],
      pages: [
        {
          status: true,
          data: {
            ordinalsCollection: { id: "", numericId: 1, isActive: false },
            ordinals: content?.data ?? [],
          },
        },
      ],
    };
  };

  return (
    <main onClick={handleBodyClick} className="app-page">
      <section
        onClick={(e) => e.stopPropagation()}
        className="mx-auto flex h-full min-h-screen w-full max-w-[25rem] flex-col pb-36 text-white  "
      >
        <div className="sticky top-0 z-20 bg-appBlue100  pt-12 ">
          <DashboardTitle
            rightIcon={
              collectionDetails?.isActive === false ? (
                <QuickActions options={options} />
              ) : undefined
            }
            title={`${!!collectionIndex ? `Collection ${collectionIndex}` : !ordinalsByOrdinalsCollectionId ? "Collection not found." : ordinalsByOrdinalsCollectionId?.pages?.length < 1 ? "Collection" : "Collection " + collectionDetails?.numericId}`}
          />

          {!!collectionDetails?.isActive ? (
            <AppSearchInput
              disabled={!collectionDetails?.isActive}
              onSearchClick={() => {}}
              value={lightningSearchValue}
              onChange={(value) =>
                setLightningSearchValue(value?.currentTarget?.value)
              }
              placeholder={translatedValues["Lightning Address"]}
            />
          ) : (
            <AppSearchInput
              disabled={!ordinalsByOrdinalsCollectionId}
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
        ) : !ordinalsByOrdinalsCollectionId ? (
          <AppErrorComponent
            title={
              translatedValues[
                "The ordinals in the collection with the given id could not be found."
              ]
            }
          />
        ) : !!firstPageOrdinal && firstPageOrdinal?.length < 1 ? (
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
            isFiltered={isFiltered}
            userLightningAddress={debouncedLightningValue}
            data={getCurrentData()}
            isFetchingNextPage={isFetchingNextPage}
            isSearchLoading={isContentLoading}
            onEndReached={() => {
              if (hasNextPage && !isFetching) {
                fetchNextPage();
              }
            }}
          />
        )}
      </section>
    </main>
  );
};

export default OrdinalsCollectionPage;
