import React from "react";
import { useNavigate } from "react-router-dom";
import { bell, logo, userLogin } from "../assets";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 slim-scrollbar w-full">
      {/* Header */}
      <div className="flex relative justify-center items-center">
        <h1 className="font-extrabold text-lg">Dashboard</h1>
        <div className="flex gap-2 absolute right-1 justify-end">
          {/* <img src={bell} className="w-6 h-6" alt="Notifications" />
          <img src={userLogin} className="w-6 h-6" alt="User" /> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
        <img src={logo} alt="Logo" className="w-16 animate-pulse" />
        <h2 className="text-2xl font-semibold text-gray-700">
          Dashboard Coming Soon
        </h2>
        <p className="text-gray-500">
          We are working hard to bring you a full dashboard experience!
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
