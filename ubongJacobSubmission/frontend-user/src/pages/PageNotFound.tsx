import PageNotFoundImage from "@/assets/images/page-not-found.svg";
import routes from "@/navigation/routes";
import { useNavigationHistoryStore } from "@/stores/navigationHistoryStore";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useStore } from "zustand";

const PageNotFound = (): JSX.Element => {
  const navigate = useNavigate();

  const { history, deleteLastRoute } = useStore(useNavigationHistoryStore);

  const handleBackClick = () => {
    if (history.length > 1) {
      deleteLastRoute();
      navigate(-1);
    } else {
      window.location.replace(routes.HOME_PAGE);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10 text-white">
      <img
        alt="Sorry, page no found"
        className="max-w-xl"
        src={PageNotFoundImage}
      />
      <button
        className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-xl font-medium text-white transition-all duration-300 hover:scale-110 hover:bg-blue-800"
        type="button"
        onClick={handleBackClick}
      >
        <Icon
          className="text-xl md:text-2xl lg:text-3xl"
          icon="line-md:arrow-small-left"
        />
        <span>Go back</span>
      </button>
    </main>
  );
};

export default PageNotFound;
