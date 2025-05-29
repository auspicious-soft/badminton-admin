import React from "react";
import RefundImage from "@/assets/images/RefundImage.png";
import Image from "next/image";

import { useState } from "react";

export default function RefundConfirmation({ open, setOpen }) {
  const [confirmed, setConfirmed] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full">
      <div className="bg-white p-6 rounded-2xl  text-center shadow-lg w-[50%] px-[67px] py-[40px] ">
        <div className="flex justify-center mb-[20px]">
          <div className="relative rounded-full flex items-center justify-center">
            <Image src={RefundImage} alt="Refund" width={194} height={191} />
          </div>
        </div>
        <h2 className="text-center text-[#10375c] mb-[20px] text-[28px] font-bold  leading-[44px]">
          Are you sure you want to proceed with the refund?
        </h2>
        <div className="mt-6 flex justify-center gap-[10px]">
          <button
            className="h-12 w-full bg-white rounded-[28px] border border-[#10375c]   whitespace-nowrap text-[#10375c] text-sm font-medium "
            onClick={() => {
                setConfirmed(true);
                setOpen(false);
              }}
          >
            Yes, I`&apos;`ll Go Ahead
          </button>
          <button
            className="w-full h-12 text-white text-sm font-medium  bg-[#10375c] rounded-[28px] justify-center  whitespace-nowrap"
            onClick={() => setOpen(false)}
            
          >
            No, Abort
          </button>
        </div>
        {confirmed && (
          <p className="mt-4 text-green-600 font-medium">
            Refund Processed Successfully!
          </p>
        )}
      </div>
    </div>
  );
}
