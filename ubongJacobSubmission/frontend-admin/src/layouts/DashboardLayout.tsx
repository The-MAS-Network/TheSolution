import { Outlet } from "react-router-dom";

const DashboardLayout = (): JSX.Element => {
  return (
    <div className="mx-auto w-full">
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
