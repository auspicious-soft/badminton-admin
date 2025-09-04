"use client"
import { useState } from "react";
import ProductCard from "./ProductCard";
import TablePagination from "../TablePagination";
import useSWR from "swr";
import { getAllMerchandise } from "@/services/admin-services";
import { getImageClientS3URL } from "@/config/axios";

const ProductList = () => {

  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const   {data, isLoading} = useSWR(
    `/admin/products?page=${page}&limit=${itemsPerPage}`, getAllMerchandise
  );
 const productData = data?.data?.data || [];
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // setQuery(`page=${newPage}&limit=${itemsPerPage}`);
  };
return (
    <div className="w-full mt-[20px] bg-[#f2f2f4] rounded-[20px] p-[20px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[20px]">
        {isLoading ? (
                <p className="text-left text-[#10375C] py-4">Loading...</p>
              ) : productData.length === 0 ? (
          <div className="no-data">
            <p>No Data Found</p>
          </div>
        ) : (
          productData?.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              image={getImageClientS3URL(product?.primaryImage)}
            />
          ))
        )}
      </div>
      {/* Pagination */}
      {productData.length !== 0 && (
        <div className="mt-[30px] flex justify-end gap-2">
          <TablePagination
            setPage={handlePageChange}
            page={page}
            totalData={productData.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
};

export default ProductList;
