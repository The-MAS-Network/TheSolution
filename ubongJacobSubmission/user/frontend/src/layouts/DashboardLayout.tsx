import { Outlet } from "react-router-dom";

const DashboardLayout = (): JSX.Element => {
  return (
    <div className=" bg-appBlue100">
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
