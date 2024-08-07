import OrdinalIcon from "@/components/icons/OrdinalIcon";
import routes from "@/navigation/routes";
import { appStateStore } from "@/stores/appState.store";
import { OrdinalsCollectionPageState } from "@/types";
import { OrdinalCollection } from "@/types/api/ordinals.types";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import DeactivateOrdinalCollectionCard from "./DeactivateOrdinalCollectionCard";
import DeleteCollectionCard from "./DeleteCollectionCard";
import { useAppTranslator } from "@/hooks/useAppTranslator";

interface Props {
  collection: OrdinalCollection;
}

const pageValues = ["Change to Inactive", "Collection"] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const OrdinalCollectionCard = ({ collection }: Props): JSX.Element => {
  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });

  const { setActiveModal } = useStore(appStateStore);
  const [isVisible, setVisibility] = useState(false);
  const navigate = useNavigate();

  const handleDelete = () => {
    setActiveModal({
      modalType: "EMPTY_MODAL",
      shouldBackgroundClose: true,
      emptyModalComponent: <DeleteCollectionCard collection={collection} />,
    });
  };

  const isActive = !!collection?.isActive;

  const handleStatusToggle = () => {
    setActiveModal({
      modalType: "EMPTY_MODAL",
      shouldBackgroundClose: true,
      emptyModalComponent: (
        <DeactivateOrdinalCollectionCard ordinalCollection={collection} />
      ),
    });
  };

  const handleBlur = () => {
    setTimeout(() => {
      setVisibility(false);
    }, 300);
  };

  return (
    <li
      onClick={() =>
        navigate(routes.ORDINAL_COLLECTION_PAGE(collection?.id), {
          state: {
            collectionIndex: collection?.numericId,
          } as OrdinalsCollectionPageState,
        })
      }
      className={`relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-y-3 rounded-2xl  p-3 md:p-4 lg:p-5 ${isActive ? "bg-appYellow500" : "bg-appBlue800"}`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="absolute right-0 top-0 z-10 cursor-default  p-4"
      >
        {isActive ? (
          <span className="relative">
            <span
              onBlur={handleBlur}
              onClick={() => setVisibility((value) => !value)}
              className={`hover:text-appBlue120 -z-[1] cursor-pointer text-3xl transition-all duration-300`}
            >
              <Icon icon="mi:options-vertical" />
            </span>

            <ul
              className={`bg-appDarkBlue100 absolute -left-[450%] top-[70%] z-[3] flex w-max flex-col gap-3 rounded-xl   transition-all  ${isVisible ? "scale-100" : "scale-0"}`}
            >
              <li
                onClick={handleStatusToggle}
                className="hover:text-appYellow100  flex cursor-pointer items-center gap-2 p-4 text-sm  font-normal transition-all duration-300 sm:text-base"
              >
                {translatedValues?.["Change to Inactive"]}
              </li>
            </ul>
          </span>
        ) : (
          <Icon
            onClick={handleDelete}
            className="hover:text-appYellow100  cursor-pointer text-3xl transition-all duration-300"
            icon="mi:options-vertical"
          />
        )}
      </button>
      <OrdinalIcon className="text-2xl" />
      <p className="text-sm font-semibold sm:text-base">
        {translatedValues?.Collection} {collection?.numericId}
      </p>
    </li>
    // </Link>
  );
};

export default OrdinalCollectionCard;
