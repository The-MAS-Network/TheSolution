import { useAppTranslator } from "@/hooks/useAppTranslator";
import { appStateStore } from "@/stores/appState.store";
import { Ordinal } from "@/types/api/ordinals.types";
import {
  CheckOrdinalContentType,
  copyTextToClipboard,
  generateOrdinalContentLink,
  generateOrdinalShareLink,
  truncateText,
} from "@/utilities";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useStore } from "zustand";
import DeleteOrdinalCard from "./DeleteOrdinalCard";
import AppIframe from "@/components/AppIframe";

const pageValues = ["Remove"] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const OrdinalCard = ({ ordinal }: { ordinal: Ordinal }): JSX.Element => {
  const text = generateOrdinalShareLink(ordinal.ordinalId);
  const { isQuickActionEdit, setIsQuickActionEdit } = useStore(appStateStore);

  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });

  const { setActiveModal } = useStore(appStateStore);

  const handleDelete = () => {
    setActiveModal({
      modalType: "Type one",
      shouldBackgroundClose: true,
      modalOneComponent: <DeleteOrdinalCard ordinal={ordinal} />,
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
          className="absolute inset-0 flex items-center justify-center rounded-xl border border-appLight500 bg-appRed500 "
        >
          <button
            onClick={handleDelete}
            type="button"
            className="flex items-center  gap-2 rounded-full bg-white px-3 py-2 text-base font-semibold text-appRed600 transition-all hover:scale-105 active:scale-90 disabled:cursor-not-allowed"
          >
            <span>{translatedValues.Remove}</span>
            <Icon icon="fluent:delete-32-regular" className="text-2xl" />
          </button>
        </div>
      )}
      <div className="flex h-full flex-col overflow-hidden rounded-xl bg-appDarkBlue600 text-sm  text-white">
        <div className="custom-break-words flex min-h-32 flex-1 items-center justify-center overflow-auto rounded-b-xl bg-appBlue160   text-center">
          {contentType === "HTML" ? (
            <AppIframe src={generateOrdinalContentLink(ordinal.ordinalId)} />
          ) : contentType === "Image" ? (
            <img
              draggable={false}
              src={generateOrdinalContentLink(ordinal.ordinalId)}
              className="w-full"
            />
          ) : (
            <p className="custom-break-words !line-clamp-[8] px-2 py-6">
              {truncateText(JSON.stringify(ordinal?.possibleOrdinalContent))}
            </p>
          )}
        </div>
        <footer className="flex items-center justify-between gap-3  px-2 py-2">
          <p className="truncate">{text}</p>
          <button
            type="button"
            onClick={() => copyTextToClipboard("https://" + text)}
            className="transition-all duration-300 hover:scale-110 hover:text-appYellow100 active:scale-95"
          >
            <Icon icon="solar:copy-line-duotone" className="text-xl" />
          </button>
        </footer>
      </div>
    </div>
  );
};

export default OrdinalCard;
