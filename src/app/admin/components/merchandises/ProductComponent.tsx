"use client"
import { useState } from "react";
import ProductCard from "./ProductCard";
import TablePagination from "../TablePagination";
import useSWR from "swr";
import { getAllMerchandise } from "@/services/admin-services";
import { getImageClientS3URL } from "@/config/axios";

const ProductList = () => {
     const dummyProducts = [
     {
       id: 1,
       name: 'Tennis Social Club Oversized Sweatshirt',
       image: 'https://via.placeholder.com/300x200.png?text=Tennis+Sweatshirt',
       price: 45.99,
       category: 'Sweatshirts',
     },
     {
       id: 2,
       name: 'Tennis Social Club T-Shirt',
       image: 'https://via.placeholder.com/300x200.png?text=Tennis+T-Shirt',
       price: 25.99,
       category: 'T-Shirts',
     },
     {
       id: 3,
       name: 'Tennis Social Club Hat',
       image: 'https://via.placeholder.com/300x200.png?text=Tennis+Hat',
       price: 19.99,
       category: 'Accessories',
     },
     {
       id: 4,
       name: 'Tennis Social Club Mug',
       image: 'https://via.placeholder.com/300x200.png?text=Tennis+Mug',
       price: 12.99,
       category: 'Merchandise',
     },
     {
       id: 5,
       name: 'Rafa Nadal Tennis Sweatshirt',
       image: 'https://via.placeholder.com/300x200.png?text=Rafa+Sweatshirt',
       price: 49.99,
       category: 'Sweatshirts',
     },
     {
       id: 6,
       name: 'Happy on Court Sweatshirt',
       image: 'https://via.placeholder.com/300x200.png?text=Happy+Court+Sweatshirt',
       price: 44.99,
       category: 'Sweatshirts',
     },
     {
       id: 7,
       name: 'Tennis Social Club Oversized Sweatshirt',
       image: 'https://via.placeholder.com/300x200.png?text=Tennis+Sweatshirt',
       price: 45.99,
       category: 'Sweatshirts',
     },
     {
       id: 8,
       name: 'Tennis Social Club T-Shirt',
       image: 'https://via.placeholder.com/300x200.png?text=Tennis+T-Shirt',
       price: 25.99,
       category: 'T-Shirts',
     },
     {
       id: 9,
       name: 'Tennis Social Club Hat',
       image: 'https://via.placeholder.com/300x200.png?text=Tennis+Hat',
       price: 19.99,
       category: 'Accessories',
     },
     {
       id: 10,
       name: 'Tennis Social Club Mug',
       image: 'https://via.placeholder.com/300x200.png?text=Tennis+Mug',
       price: 12.99,
       category: 'Merchandise',
     },
     {
       id: 11,
       name: 'Rafa Nadal Tennis Sweatshirt',
       image: 'https://via.placeholder.com/300x200.png?text=Rafa+Sweatshirt',
       price: 49.99,
       category: 'Sweatshirts',
     },
     {
       id: 12,
       name: 'Happy on Court Sweatshirt',
       image: 'https://via.placeholder.com/300x200.png?text=Happy+Court+Sweatshirt',
       price: 44.99,
       category: 'Sweatshirts',
     },
    
   ];
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const   {data, isLoading} = useSWR(
    `/admin/products?page=${page}&limit=${itemsPerPage}`, getAllMerchandise
  );
  console.log(data, "data");
 const productData = data?.data?.data || [];
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // setQuery(`page=${newPage}&limit=${itemsPerPage}`);
  };
  return (
    <div className="w-full mt-[20px] bg-[#f2f2f4] rounded-[20px] p-[20px]">
    <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[20px]">
      {productData?.map((product) => (
        <ProductCard key={product._id} product={product} image={getImageClientS3URL(product?.primaryImage)} />
      ))}
    </div>
     {/* Pagination */}

     <div className="mt-[30px] flex justify-end gap-2">
              <TablePagination
                setPage={handlePageChange}
                page={page}
                totalData={dummyProducts.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
            
    </div>
  );
};

export default ProductList;