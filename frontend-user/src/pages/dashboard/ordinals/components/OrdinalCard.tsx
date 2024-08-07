import { Icon } from "@iconify/react/dist/iconify.js";

import { ordinalBaseApi } from "@/api/base.api";
import AppIframe from "@/components/AppIframe";
import { ISimpleOrdinalData } from "@/types/api/ordinals.types";
import {
  CheckOrdinalContentType,
  copyTextToClipboard,
  generateOrdinalContentLink,
  generateOrdinalShareLink,
  parseString,
  truncateText,
} from "@/utilities";
import { handleApiErrors } from "@/utilities/handleErrors";
import { useQuery } from "@tanstack/react-query";

const OrdinalCard = ({
  ordinal,
}: {
  ordinal: ISimpleOrdinalData;
}): JSX.Element => {
  const text = generateOrdinalShareLink(ordinal?.ordinalId?.toString());

  const contentType = CheckOrdinalContentType({
    content_type: ordinal.contentType,
    mime_type: ordinal.mimeType,
  });

  const { data: content } = useQuery({
    queryKey: ["getOrdinalContent", ordinal.ordinalId],
    queryFn: async () => {
      if (
        contentType === "Text" ||
        contentType === "JSON" ||
        contentType === "Unknown"
      ) {
        const response = await ordinalBaseApi.get(`/${ordinal?.ordinalId}`);
        if (response.ok) {
          return response?.data;
        } else {
          handleApiErrors(response);
          return null;
        }
      } else {
        return null;
      }
    },
    enabled:
      contentType === "Text" ||
      contentType === "JSON" ||
      contentType === "Unknown",
  });

  return (
    <div className="relative ">
      <div className="flex h-full flex-col overflow-hidden rounded-xl bg-appDarkBlue600 text-sm  text-white">
        <div className="custom-break-words flex min-h-32 flex-1 items-center justify-center overflow-auto rounded-b-xl bg-appBlue160   text-center">
          {contentType === "HTML" ? (
            <div className="max-h-56">
              <AppIframe src={generateOrdinalContentLink(ordinal?.ordinalId)} />
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
              <p className="!line-clamp-[8] whitespace-pre-wrap px-2 py-6">
                {parseString(content) as string}
              </p>
            </div>
          ) : (
            <div className="max-h-56">
              <p className="custom-break-words !line-clamp-[8] whitespace-pre-wrap px-2 py-6">
                {truncateText(JSON.stringify(content))}
              </p>
            </div>
          )}
        </div>
        <footer className="flex items-center justify-between  px-2 py-2">
          <p className="block truncate pr-2">{text}</p>

          <button
            type="button"
            onClick={() =>
              copyTextToClipboard({
                successText: "Link successfully copied to clipboard.",
                text: "https://" + text,
                errorText: "Unable to copy link to clipboard ",
              })
            }
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
