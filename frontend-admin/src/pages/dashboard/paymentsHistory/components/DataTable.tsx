import { useAppTranslator } from "@/hooks/useAppTranslator";
import { useSingleTranslator } from "@/hooks/useSingleTranslator";
import { GetAllTipsByGroupIdRes } from "@/types/api/ordinals.types";
import { copyTextToClipboard, truncateWalletAddress } from "@/utilities";
import { Icon } from "@iconify/react/dist/iconify.js";
import { InfiniteData } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Fragment } from "react";
import StatusPill from "./StatusPill";

interface Props {
  data:
    | InfiniteData<GetAllTipsByGroupIdRes | null | undefined, unknown>
    | undefined;
}

const pageValues = [
  "Payment Status",
  "Lightning Address",
  "Payment Time",
] as const;

type PageValuesType = {
  [k in (typeof pageValues)[number]]: string;
};

const pageValuesObject = pageValues.reduce((acc, value) => {
  return { ...acc, [value]: value };
}, {});

const DataTable = ({ data }: Props): JSX.Element => {
  const paymentTime = data?.pages[0]?.data?.ordinalTipsGroup?.createdAt;
  const individualAmount = Math.max(
    data?.pages[0]?.data?.ordinalTipsGroup?.individualAmount ?? 1,
    1,
  );

  const { translatedValues } = useAppTranslator<PageValuesType>({
    ...pageValuesObject,
  });

  const translatedTime = useSingleTranslator(
    dayjs(paymentTime).format("DD MMM YYYY,  HH:mm"),
  );

  return (
    <>
      <dl className="flex items-center justify-between gap-5 px-2 font-baloo2">
        <dt className="text-sm text-appBlue170 sm:text-base">
          {translatedValues?.["Payment Time"]}
        </dt>
        <dd className="text-sm font-medium text-white sm:text-base">
          {translatedTime}
        </dd>
      </dl>

      <div className="mx-2 my-4 border border-dashed border-appBlue180" />

      <dl className="flex items-center justify-between px-2 font-baloo2 text-sm font-medium text-white sm:text-base">
        <dt>{translatedValues?.["Lightning Address"]}</dt>
        <dd>{translatedValues?.["Payment Status"]}</dd>
      </dl>

      <ul className="mt-2 flex flex-col gap-y-2 md:mt-4 md:gap-y-3">
        {data?.pages.map((page, index) => (
          <Fragment key={index}>
            {page?.data?.ordinalTips?.map(
              ({ status, lightningAddress, amount }, key) => (
                <li
                  key={key}
                  className="flex items-center justify-between rounded-xl bg-appBlue800 p-3 pl-4 sm:p-4 sm:pl-5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      onClick={() =>
                        copyTextToClipboard(
                          lightningAddress,
                          "Address successfully copied to clipboard",
                        )
                      }
                      className="flex cursor-pointer items-center gap-2 text-sm font-normal transition-all duration-300 hover:text-appYellow100"
                    >
                      <Icon
                        icon="solar:copy-line-duotone"
                        className="text-xl"
                      />
                    </span>
                    <dl>
                      <dt className="flex items-center gap-1">
                        <span>{truncateWalletAddress(lightningAddress)}</span>
                        {!!individualAmount && individualAmount > 1 && (
                          <span> x {amount / individualAmount}</span>
                        )}
                      </dt>
                      <dd className="text-xs">{amount?.toLocaleString()}</dd>
                    </dl>
                  </div>

                  <StatusPill status={status} />
                </li>
              ),
            )}
          </Fragment>
        ))}
      </ul>
    </>
  );
};

export default DataTable;
