import {
  getActiveOrdinalCollectionsKey,
  getOrdinalCollections,
} from "@/api/ordinals.api";
import { handleApiErrors } from "@/utilities/handleErrors";
import { useQuery } from "@tanstack/react-query";
import EmptyCollectionComponent from "./components/EmptyCollectionComponent";
import OrdinalCollectionCard from "./components/OrdinalCollectionCard";

const ActiveOrdinals = (): JSX.Element => {
  const { data } = useQuery({
    queryKey: [getActiveOrdinalCollectionsKey],
    queryFn: async () => {
      const response = await getOrdinalCollections({ status: "active" });
      if (response.ok) {
        return response?.data?.data;
      } else {
        handleApiErrors(response);
        return null;
      }
    },
  });

  return (
    <>
      {!!data && data?.length > 0 ? (
        <ul className="grid grid-cols-2 gap-x-5 gap-y-8">
          {data?.map((collection, key) => (
            <OrdinalCollectionCard collection={collection} key={key} />
          ))}
        </ul>
      ) : (
        <EmptyCollectionComponent />
      )}
    </>
  );
};

export default ActiveOrdinals;
