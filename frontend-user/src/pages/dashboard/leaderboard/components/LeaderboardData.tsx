import ProfileImage from "@/assets/images/profile.png";
import EmptyDataComponent from "@/components/EmptyDataComponent";
import { EmojioneV1LightningMood } from "@/components/icons";
import { GetLeaderboardRes } from "@/types/api/payments.types";
import { convertSVGtoURL } from "@/utilities";
import { InfiniteData } from "@tanstack/react-query";
import { Fragment } from "react/jsx-runtime";

interface Props {
  data: InfiniteData<GetLeaderboardRes | null | undefined, unknown> | undefined;
  title: string;
  emptyDataMessage: string;
}
const getProfileImage = (imageURL: string) => {
  if (imageURL?.startsWith("<svg")) return convertSVGtoURL(imageURL);
  else return ProfileImage;
};

const LeaderboardData = ({
  data,
  title,
  emptyDataMessage,
}: Props): JSX.Element => {
  const firstData = data?.pages?.[0]?.data;
  return (
    <>
      <h2 className="text-center text-lg font-semibold text-appYellow300 md:text-xl lg:text-2xl">
        {title}
      </h2>

      {!!firstData && firstData.length > 0 ? (
        <ul>
          {data?.pages?.map((value, key) => (
            <Fragment key={key}>
              {value?.data?.map(({ amount, user, lightningAddress }, index) => (
                <li
                  className="flex items-center border-b border-appDarkBlue800 py-2 last:border-b-0"
                  key={index}
                >
                  <data
                    className={`leaderboard-number-white-gradient flex aspect-square w-full min-w-7 max-w-max items-center justify-center rounded-full p-1  text-sm font-semibold text-appDarkBlue100 ${index < 3 ? "leaderboard-number-yellow-gradient" : "leaderboard-number-white-gradient"}`}
                    value={1}
                  >
                    {index + 1}
                  </data>

                  <figure className="leaderboard-profie-gradient ml-2 overflow-hidden rounded-full p-1">
                    <img
                      className=" size-12 rounded-full bg-appDarkBlue700  object-contain"
                      src={getProfileImage(user?.imageURL ?? "")}
                      alt="profile picure"
                    />
                  </figure>

                  <p className="flex-1 truncate px-3 text-sm font-normal text-white">
                    {lightningAddress}
                  </p>

                  <dl className="flex flex-col items-end">
                    <dt className="text-sm font-medium text-appYellow110">
                      SATs
                    </dt>
                    <dd className="flex items-center">
                      <data
                        className="text-sm font-bold  text-white sm:text-base"
                        value={amount}
                      >
                        {amount?.toLocaleString()}
                      </data>
                      <EmojioneV1LightningMood className="ml-1 text-base" />
                    </dd>
                  </dl>
                </li>
              ))}
            </Fragment>
          ))}
        </ul>
      ) : (
        <EmptyDataComponent message={emptyDataMessage} />
      )}
    </>
  );
};

export default LeaderboardData;
