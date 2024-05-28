import {
  getInactiveOrdinalsKey,
  getOrdinalCollections,
} from "@/api/ordinals.api";
import { handleApiErrors } from "@/utilities/handleErrors";
import { useQuery } from "@tanstack/react-query";
import NewOrdinalCollectionCard from "./components/NewOrdinalCollectionCard";
import OrdinalCollectionCard from "./components/OrdinalCollectionCard";

const InactiveOrdinals = (): JSX.Element => {
  const { data } = useQuery({
    queryKey: [getInactiveOrdinalsKey],
    queryFn: async () => {
      const response = await getOrdinalCollections({ status: "inactive" });
      if (response.ok) {
        return response?.data?.data;
      } else {
        handleApiErrors(response);
        return null;
      }
    },
  });

  return (
    <ul className="mt-2 grid grid-cols-2 gap-x-5 gap-y-8">
      {data?.map((collection, key) => (
        <OrdinalCollectionCard collection={collection} key={key} />
      ))}
      <NewOrdinalCollectionCard />
    </ul>
  );
};

export default InactiveOrdinals;
