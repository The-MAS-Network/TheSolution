import {
  EmojioneV1LightningMood,
  IconamoonArrowDown2Bold,
} from "@/components/icons";
import routes from "@/navigation/routes";
import { Link } from "react-router-dom";

interface Props {
  id: string;
  date: string;
  total: number;
  totalSent: number;
  collectionNumber: number;
}

const CollectionHistoryCard = (props: Props): JSX.Element => {
  const { date, id, total, totalSent, collectionNumber } = props;
  return (
    <li>
      <Link
        to={routes.PAYMENTS_HISTORY_DETAILS_PAGE(id)}
        className="flex items-center gap-2 rounded-xl bg-appBlue160 px-4 py-3 font-baloo2 font-normal"
      >
        <dl className="flex-1">
          <dt className="text-sm">Collection {collectionNumber}</dt>
          <time className="text-xs text-appLight500" dateTime={date}>
            {date}
          </time>
        </dl>

        <data className="flex items-center text-xl font-medium" value="600">
          <EmojioneV1LightningMood className="text-base" />
          <span className="pl-1">{totalSent} / </span>
          <span className="pl-1 text-base text-appYellow300"> {total}</span>
        </data>
        <IconamoonArrowDown2Bold className="-rotate-90 text-xl" />
      </Link>
    </li>
  );
};

export default CollectionHistoryCard;
