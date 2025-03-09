import React, { useState } from "react";
import { AiOutlineFilter, AiOutlineMoneyCollect } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link, useNavigate } from "react-router-dom";
import { MdBorderClear } from "react-icons/md";
import { DataGrid } from "@material-ui/data-grid";
import { useRecoilValue } from "recoil";
import { sellerOrderState } from "../../recoil/atoms/sellerorder";
import useSellerAuth from "../../hooks/getSeller";
import { Line, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { sellerState } from "../../recoil/atoms/seller";
import useGetSellerAllOrders from "../../hooks/Shop/getSellerAllOrders";
import useGetProducts from "../../hooks/getProducts";

// Helper function to filter orders based on the selected duration
const filterOrdersByDate = (orders, filter) => {
  const now = new Date();
  return orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const diffTime = now - orderDate;
    switch (filter) {
      case "today":
        return orderDate.toDateString() === now.toDateString();
      case "lastWeek":
        return diffTime <= 7 * 24 * 60 * 60 * 1000;
      case "lastMonth":
        return diffTime <= 30 * 24 * 60 * 60 * 1000;
      case "lastYear":
        return diffTime <= 365 * 24 * 60 * 60 * 1000;
      case "fromBeginning":
        return true;
      default:
        return true;
    }
  });
};

const DashboardHero = () => {
  const navigate = useNavigate();
  const { seller } = useSellerAuth();
  const { _id } = useRecoilValue(sellerState);
  const { products } = useGetProducts(_id);
  const { sellerOrders } = useGetSellerAllOrders();

  const [filter, setFilter] = useState("fromBeginning");

  const filteredOrders = filterOrdersByDate(sellerOrders, filter);

  // Calculate total sales from filtered orders
  const totalSales = filteredOrders?.reduce((acc, order) => acc + (order.totalPrice || 0), 0).toFixed(2) || "0.00";

  const availableBalance = seller?.availableBalance?.toFixed(2) || "0.00";

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 1 },
    {
      field: "productName",
      headerName: "Product Name",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 0.6,
      cellClassName: (params) =>
        params.row.status === "Delivered" ? "greenColor" : "redColor",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 90,
      flex: 0.5,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 100,
      flex: 0.6,
    },
  ];

  const rows =
    filteredOrders?.map((order) => ({
      id: order._id,
      productName:
        Array.isArray(order.cart) && order.cart.length > 0
          ? order.cart[0]?.name || "N/A"
          : "N/A",
      itemsQty: Array.isArray(order.cart)
        ? order.cart.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0)
        : 0,
      total: `US$ ${order.totalPrice}`,
      status: order.status,
    })) || [];

  const lineChartData = {
    labels: filteredOrders?.map((order) =>
      new Date(order.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Total Sales (US$)",
        data: filteredOrders?.map((order) => order.totalPrice),
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
    ],
  };

  const pieChartData = {
    labels: ["Delivered", "Pending", "Cancelled"],
    datasets: [
      {
        data: [
          filteredOrders?.filter((order) => order.status === "Delivered").length ||
          0,
          filteredOrders?.filter((order) => order.status === "Processing").length ||
          0,
          filteredOrders?.filter((order) => order.status === "Refunded").length ||
          0,
        ],
        backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
        hoverBackgroundColor: ["#45a049", "#ff9d3f", "#f55454"],
      },
    ],
  };

  const handleRowClick = (params) => {
    navigate(`/dashboard/order/${params.id}`);
  };

  return (
    <>
      <div className="relative w-full p-2">
        {/* Filter Dropdown with Icon */}
        <div className="absolute top-2 right-0 mt-4 mr-4 flex items-center space-x-2">
          <AiOutlineFilter size={20} className="text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="today">Today</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="lastYear">Last Year</option>
            <option value="fromBeginning">From Beginning</option>
          </select>
        </div>
      </div>

      <div className="w-full p-2">
        <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
        <div className="relative w-full grid grid-cols-1 800px:grid-cols-3 gap-4">
          {/* Total Sales Card */}
          <div className="w-full h-[150px] bg-white shadow rounded px-4 py-5 flex flex-col justify-between">
            <div className="flex items-center">
              <MdBorderClear size={30} className="mr-2" fill="#00000085" />
              <h3
                className={`${styles.productTitle} !text-[18px] leading-5 text-[#00000085]`}
              >
                Total Sales
              </h3>
            </div>
            <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
              US$ {totalSales}
            </h5>
          </div>

          {/* All Orders Card */}
          <div className="w-full h-[150px] bg-white shadow rounded px-4 py-5 flex flex-col justify-between">
            <div className="flex items-center">
              <MdBorderClear size={30} className="mr-2" fill="#00000085" />
              <h3
                className={`${styles.productTitle} !text-[18px] leading-5 text-[#00000085]`}
              >
                All Orders
              </h3>
            </div>
            <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
              {sellerOrders?.length || 0}
            </h5>
            <Link to="/dashboard-orders">
              <h5 className="pt-2 pl-2 text-[#077f9c]">View Orders</h5>
            </Link>
          </div>

          {/* All Products Card */}
          <div className="w-full h-[150px] bg-white shadow rounded px-4 py-5 flex flex-col justify-between">
            <div className="flex items-center">
              <AiOutlineMoneyCollect
                size={30}
                className="mr-2"
                fill="#00000085"
              />
              <h3
                className={`${styles.productTitle} !text-[18px] leading-5 text-[#00000085]`}
              >
                All Products
              </h3>
            </div>
            <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
              {products?.length || 0}
            </h5>
            <Link to="/dashboard-products">
              <h5 className="pt-2 pl-2 text-[#077f9c]">View Products</h5>
            </Link>
          </div>
        </div>
        <br />

        {/* Latest Orders */}
        <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>
        <div className="w-full min-h-[45vh] bg-white rounded overflow-x-auto">
          {rows.length === 0 ? (
            <div className="w-full text-center">No orders to display</div>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              disableSelectionOnClick
              autoHeight
              onRowClick={handleRowClick}
            />
          )}
        </div>
        <br />

        {/* Charts */}
        <h3 className="text-[22px] font-Poppins pb-2">Sales Overview</h3>
<div className="w-full grid grid-cols-1 gap-6 p-5 rounded shadow 800px:grid-cols-2">

  {/* Line Chart Container */}
  <div className="w-full bg-white shadow rounded p-4">
    <h4 className="text-[18px] font-semibold text-[#00000085] mb-4">Line Chart: Sales Trend</h4>
    <div className="h-[250px] 800px:h-[300px] w-full flex justify-center items-center">
      <Line data={lineChartData} options={{ responsive: true }} />
    </div>
  </div>

  {/* Pie Chart Container */}
  <div className="w-full bg-white shadow rounded p-4">
    <h4 className="text-[18px] font-semibold text-[#00000085] mb-4">Pie Chart: Sales Distribution</h4>
    <div className="h-[250px] 800px:h-[300px] w-full flex justify-center items-center">
      <Pie
        data={pieChartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>
  </div>
  
</div>


      </div>
    </>
  );
};

export default DashboardHero;