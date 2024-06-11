import { EmojioneV1LightningMood } from "@/components/icons";

interface Props {
  date: string;
  totalSent: number;
  address: string;
}

const UserHistoryCard = (props: Props): JSX.Element => {
  const { date, totalSent, address } = props;
  return (
    <li className="flex items-center gap-2 rounded-xl bg-appBlue160 px-4 py-3 font-baloo2 font-normal">
      <dl className="flex-1">
        <dt className="text-sm">{address}</dt>
        <time className="text-xs text-appLight500" dateTime={date}>
          {date}
        </time>
      </dl>

      <data className="flex items-center text-xl font-medium" value="600">
        <EmojioneV1LightningMood className="text-base" />
        <span className="pl-1">{totalSent}</span>
      </data>
    </li>
  );
};

export default UserHistoryCard;
