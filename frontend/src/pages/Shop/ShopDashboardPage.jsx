import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import DashboardHero from "../../components/Shop/DashboardHero";

const ShopDashboardPage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Header */}
      <DashboardHeader />
      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-[80px] 800px:w-[330px] bg-white min-h-screen">
          <DashboardSideBar active={1} />
        </div>
        {/* Hero Section */}
        <div className="flex-1 p-4">
          <DashboardHero />
        </div>
      </div>
    </div>
  );
};

export default ShopDashboardPage;
