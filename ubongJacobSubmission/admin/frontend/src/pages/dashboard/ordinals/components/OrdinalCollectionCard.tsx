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

interface Props {
  collection: OrdinalCollection;
}

const OrdinalCollectionCard = ({ collection }: Props): JSX.Element => {
  const { setActiveModal } = useStore(appStateStore);
  const [isVisible, setVisibility] = useState(false);
  const navigate = useNavigate();

  const handleDelete = () => {
    setActiveModal({
      modalType: "Type one",
      shouldBackgroundClose: true,
      modalOneComponent: <DeleteCollectionCard collection={collection} />,
    });
  };

  const isActive = !!collection?.isActive;

  const handleStatusToggle = () => {
    setActiveModal({
      modalType: "Type one",
      shouldBackgroundClose: true,
      modalOneComponent: (
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
            <button
              onBlur={handleBlur}
              onClick={() => setVisibility((value) => !value)}
              className={`-z-[1] text-3xl transition-all duration-300 hover:text-appBlue120`}
              type="button"
            >
              <Icon icon="mi:options-vertical" />
            </button>

            <ul
              className={`absolute -left-[450%] top-[70%] z-[3] flex w-max flex-col gap-3 rounded-xl bg-appDarkBlue100   transition-all  ${isVisible ? "scale-100" : "scale-0"}`}
            >
              <li
                onClick={handleStatusToggle}
                className="flex  cursor-pointer items-center gap-2 p-4 text-sm font-normal  transition-all duration-300 hover:text-appYellow100 sm:text-base"
              >
                Change to Inactive
              </li>
            </ul>
          </span>
        ) : (
          <Icon
            onClick={handleDelete}
            className="cursor-pointer  text-3xl transition-all duration-300 hover:text-appYellow100"
            icon="mi:options-vertical"
          />
        )}
      </button>
      <OrdinalIcon className="text-2xl" />
      <p className="text-sm font-semibold sm:text-base">
        Collection {collection?.numericId}
      </p>
    </li>
    // </Link>
  );
};

export default OrdinalCollectionCard;
