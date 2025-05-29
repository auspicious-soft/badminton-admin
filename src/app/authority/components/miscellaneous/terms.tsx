"use client";
import React, { useState, useEffect, useRef } from "react";
import TextEditor from "./Editor";
import { toast } from "sonner";
import { postTermsSettings, getTermsSettings } from "@/services/admin-services";
import useSWR from "swr";

const TermsPage = ({ name }: { name: string }) => {
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { data, mutate, isLoading } = useSWR("/admin/admin-settings", getTermsSettings);
  const actualData = data?.data?.data;
  const prevNameRef = useRef(name);
  const isFirstLoadRef = useRef(true);

  // Load data when component mounts or name changes
  useEffect(() => {
    if (actualData && actualData[name] !== undefined) {
      if (isFirstLoadRef.current || name !== prevNameRef.current) {
        setDescription(actualData[name] || "");
        prevNameRef.current = name;
        isFirstLoadRef.current = false;
      }
    }
  }, [actualData, name]);

  const handleDescriptionChange = (content: string) => {
    console.log("Description changed:", content);
    setDescription(content);
  };

  const handleSave = async () => {
    console.log("Saving description:", description);
    setIsSaving(true);
    try {
      const payload = { [name]: description };
      const response = await postTermsSettings("/admin/admin-settings", payload);
      
      if (response?.status === 200 || response?.status === 201) {
        toast.success(`${name} updated successfully`);
        mutate();
      } else {
        throw new Error(response?.data?.message || "Failed to update settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(error.message || "Something went wrong while saving");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="px-[30px] py-[30px] bg-white rounded-[20px]">
      <TextEditor
        key={`editor-${name}`}
        value={description}
        setDescription={handleDescriptionChange}
      />
      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`mt-4 px-4 py-2 rounded-3xl text-white text-sm font-medium w-full ${
          isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-[#10375c] hover:bg-[#0a2c4a]"
        }`}
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default TermsPage;
