import AppIframe from "@/components/AppIframe";
import {
  FluentDelete32Regular,
  SolarCopyLineDuotone,
} from "@/components/icons";
import { useAppTranslator } from "@/hooks/useAppTranslator";
import { appStateStore } from "@/stores/appState.store";
import { Ordinal } from "@/types/api/ordinals.types";
import {
  CheckOrdinalContentType,
  copyTextToClipboard,
  generateOrdinalContentLink,
  generateOrdinalShareLink,
  parseString,
  truncateText,
} from "@/utilities";
import { useStore } from "zustand";
import DeleteOrdinalCard from "./DeleteOrdinalCard";

const pageValues = ["Remove"] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

interface Props {
  ordinal: Ordinal;
  collectionId: string;
  isFiltered?: boolean;
}

const OrdinalCard = ({ ordinal, collectionId }: Props): JSX.Element => {
  const text = generateOrdinalShareLink(ordinal.ordinalId);
  const { isQuickActionEdit, setIsQuickActionEdit } = useStore(appStateStore);

  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });

  const { setActiveModal } = useStore(appStateStore);

  const handleDelete = () => {
    setActiveModal({
      modalType: "EMPTY_MODAL",
      shouldBackgroundClose: true,
      emptyModalComponent: (
        <DeleteOrdinalCard
          ordinalCollectionId={collectionId}
          ordinal={ordinal}
        />
      ),
    });
  };

  const contentType = CheckOrdinalContentType({
    content_type: ordinal.contentType,
    mime_type: ordinal.mimeType,
  });

  return (
    <div className="relative ">
      {!!isQuickActionEdit && (
        <div
          onClick={() => setIsQuickActionEdit(false)}
          className="border-appLight500 bg-appRed500 absolute inset-0 flex items-center justify-center rounded-xl border "
        >
          <button
            onClick={handleDelete}
            type="button"
            className="text-appRed600 flex  items-center gap-2 rounded-full bg-white px-3 py-2 text-base font-semibold transition-all hover:scale-105 active:scale-90 disabled:cursor-not-allowed"
          >
            <span>{translatedValues.Remove}</span>
            <FluentDelete32Regular className="text-2xl" />
          </button>
        </div>
      )}
      <div className="bg-appDarkBlue600 flex h-full flex-col overflow-hidden rounded-xl text-sm  text-white">
        <div className="custom-break-words bg-appBlue160   flex min-h-32 flex-1 items-center justify-center overflow-auto rounded-b-xl   text-center">
          {contentType === "HTML" ? (
            <div className="max-h-56">
              <AppIframe src={generateOrdinalContentLink(ordinal.ordinalId)} />
            </div>
          ) : contentType === "Image" ? (
            <div className="max-h-56">
              <img
                draggable={false}
                src={generateOrdinalContentLink(ordinal.ordinalId)}
                className="w-full"
              />
            </div>
          ) : contentType === "Text" ? (
            <div className="max-h-56">
              <p className="whitespace-pre-wrap px-2 py-6">
                {parseString(ordinal?.possibleOrdinalContent) as string}
              </p>
            </div>
          ) : (
            <div className="max-h-56">
              <p className="custom-break-words !line-clamp-[8] px-2 py-6">
                {truncateText(JSON.stringify(ordinal?.possibleOrdinalContent))}
              </p>
            </div>
          )}
        </div>
        <footer className="flex items-center justify-between gap-3  px-2 py-2">
          <p className="truncate">{text}</p>
          <button
            type="button"
            onClick={() => copyTextToClipboard("https://" + text)}
            className="hover:text-appYellow100 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <SolarCopyLineDuotone className="text-xl" />
          </button>
        </footer>
        {/* {!!isFiltered && ( */}
        {!!ordinal?.user?.lightningAddress && (
          <div className="pb-2 ">
            <hr className="border-appBlue120/50  block" />

            <div className="flex items-center  px-2 pt-2">
              <p className="truncate text-xs">
                {ordinal?.user?.lightningAddress}
              </p>

              <button
                type="button"
                onClick={() =>
                  copyTextToClipboard(
                    ordinal?.user?.lightningAddress ?? "",
                    "Lightning address successfully copied to clipboard",
                  )
                }
                className="hover:text-appYellow100 ml-auto transition-all duration-300 hover:scale-110 active:scale-95"
              >
                <SolarCopyLineDuotone className="text-xl" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdinalCard;
