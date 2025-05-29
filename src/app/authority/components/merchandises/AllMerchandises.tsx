
"use client";
import { useState } from "react";
import MerchandiseHeader from "./MerchandisesHeader";
import OrdersComponent from "./OrdersComponent";
import InventoryComponent from "./InventoryComponent";
import ProductList from "./ProductComponent";

const MerchandisePage = () => {
  const [selectedTab, setSelectedTab] = useState("Orders");

  return (
    <div className="">
      {/* Header with Tabs & Filters */}
      <div>
        <MerchandiseHeader selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </div>
      {/* Render Content Based on Selected Tab */}
      <div className=" mb-6">
        {selectedTab === "Orders" && <OrdersComponent />}
        {selectedTab === "Products" && <ProductList />}
        {selectedTab === "Inventory" && <InventoryComponent />}
      </div>
    </div>
  );
};

export default MerchandisePage;
