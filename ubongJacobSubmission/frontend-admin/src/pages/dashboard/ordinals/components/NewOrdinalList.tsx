import {
  getSingleOrdinalDataKey,
  getSingleOrdinalDataOrOrdinalWalletData,
} from "@/api/ordinals.api";
import AppLoader from "@/components/AppLoader";
import { removeHashAndComma } from "@/utilities";
import { handleApiErrors } from "@/utilities/handleErrors";
import { useQuery } from "@tanstack/react-query";
import NewOrdinalCard from "./NewOrdinalCard";

interface Props {
  searchValue: string;
  collectionId: string;
  onAddDone: () => void;
}

const NewOrdinalList = ({
  searchValue,
  collectionId,
  onAddDone,
}: Props): JSX.Element => {
  const { data, isLoading: isDataLoading } = useQuery({
    queryKey: [getSingleOrdinalDataKey, searchValue],
    queryFn: async () => {
      if (!searchValue) return null;
      const response = await getSingleOrdinalDataOrOrdinalWalletData(
        removeHashAndComma(searchValue),
      );
      if (response.ok) {
        return response?.data;
      } else {
        handleApiErrors(response);
        return null;
      }
    },
  });

  const isLoading = isDataLoading;

  if (isLoading) return <AppLoader />;

  return (
    <section>
      <ul className="grid grid-cols-2 gap-x-5 gap-y-7">
        {data?.data?.results.map((value, key) => (
          <NewOrdinalCard collectionId={collectionId} data={value} key={key} />
        ))}
      </ul>

      <div className="fixed bottom-0  mx-auto w-[90%] max-w-[25rem] bg-appBlue100 pb-4 pt-2 ">
        <button
          onClick={onAddDone}
          disabled={isLoading}
          type="button"
          className="app-button-secondary flex items-center justify-center gap-x-2"
        >
          <span> Done</span>
        </button>
      </div>
    </section>
  );
};

export default NewOrdinalList;
