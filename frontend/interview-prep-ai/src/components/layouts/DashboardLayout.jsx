import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  const { user } = useContext(UserContext);
  return (
    <div className="w-screen h-screen">
      <Navbar />

      {user && <div className="px-10 w-full h-full">{children}</div>}
    </div>
  );
};

export default DashboardLayout;
