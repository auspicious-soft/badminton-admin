import React, { useState, useTransition } from "react";
import RefundImage from "@/assets/images/RefundImage.png";
import Image from "next/image";
import { cancelMatch } from "@/services/admin-services";
import { toast } from "sonner";

export default function RefundConfirmation({ open, setOpen, id }) {
  const [confirmed, setConfirmed] = useState(false);
  const [reason, setReason] = useState("");
  const [percentage, setPercentage] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  if (!open) return null;

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        if (reason && percentage) {
          const payload = {
            id,
            reason,
            percentage,
          };
          const response = await cancelMatch("/admin/cancel-match", payload);
          toast.success("Refund done successfully")
          setConfirmed(true);
          setTimeout(() => {
            setOpen(false);
            setConfirmed(false);
            setReason("");
            setPercentage("");
          }, 2000);
        } else {
          toast.error("Please select both reason and percentage");
          setReason("");
          setPercentage("");
        }
      } catch (error: any) {
        console.log("error", error);
        toast.error(error?.response?.data?.message);
      }
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full z-50">
      <div className="bg-white p-6 rounded-2xl text-center shadow-lg w-[60%] max-w-[600px] px-[40px] py-[30px]">
        <div className="flex justify-center mb-[20px]">
          <div className="relative rounded-full flex items-center justify-center">
            <Image src={RefundImage} alt="Refund" width={194} height={191} />
          </div>
        </div>
        <h2 className="text-center text-[#10375c] mb-[20px] text-3xl font-bold leading-[32px]">
          Are you sure you want to proceed with the refund?
        </h2>

        <div className="space-y-4 mb-6">
          <div>
            <h4 className="text-start text-s font-medium mb-[8px]">
              Select Reason
            </h4>
            <select
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-[50px] px-4 py-2 bg-[#f4f5f7] rounded-[50px] border focus:border-[#176dbf] focus:ring-blue-400 text-gray-700 appearance-none cursor-pointer"
            >
              <option value="">Select Reason</option>
              <option value="Bad Weather">Bad Weather</option>
              <option value="Maintenance Issue">Maintenance Issue</option>
              <option value="Player Cancelled">Player Cancelled</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <h4 className="text-start text-s font-medium mb-[8px]">
              Refund Percentage
            </h4>
            <select
              name="percentage"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              className="w-full h-[50px] px-4 py-2 bg-[#f4f5f7] rounded-[50px] border focus:border-[#176dbf] focus:ring-blue-400 text-gray-700 appearance-none cursor-pointer"
            >
              <option value="">Select Refund Percentage</option>
              <option value="0">0%</option>
              <option value="25">25%</option>
              <option value="50">50%</option>
              <option value="75">75%</option>
              <option value="100">100%</option>
            </select>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            className="h-12 w-full bg-white border border-[#10375c] text-[#10375c] rounded-[28px] text-sm font-medium flex items-center justify-center"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent border-[#10375c]"></span>
            ) : (
              "Yes, I’ll Go Ahead"
            )}
          </button>
          <button
            className="h-12 w-full bg-[#10375c] text-white rounded-[28px] text-sm font-medium"
            onClick={() => {
              setOpen(false);
              setReason("");
              setPercentage("");
            }}
          >
            No, Abort
          </button>
        </div>
      </div>
    </div>
  );
}
