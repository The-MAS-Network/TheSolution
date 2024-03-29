import { getMaxTrialCount } from "@/api/user.api";
import { handleApiErrors } from "@/utilities/handleErrors";
import { useQuery } from "@tanstack/react-query";

export const useGetMaxTrialCount = () => {
  const response = useQuery({
    queryKey: ["getMaxTrialCount"],
    queryFn: async () => {
      const response = await getMaxTrialCount();
      if (response.ok) {
        return response?.data?.data;
      } else {
        handleApiErrors(response);
        return null;
      }
    },
  });

  return response;
};
