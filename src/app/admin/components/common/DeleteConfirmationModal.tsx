"use client";
import React from "react";
import Modal from "@mui/material/Modal";

interface DeleteConfirmationModalProps {
  /**
   * Whether the modal is open
   */
  open: boolean;
  
  /**
   * Function to close the modal
   */
  onClose: () => void;
  
  /**
   * Function to call when delete is confirmed
   */
  onDelete: () => void;
  
  /**
   * Optional title text (defaults to "Delete?")
   */
  title?: string;
  
  /**
   * Optional confirmation message (defaults to "Are you sure you want to delete this item?")
   */
  message?: string;
  
  /**
   * Optional cancel button text (defaults to "Cancel")
   */
  cancelText?: string;
  
  /**
   * Optional delete button text (defaults to "Delete")
   */
  deleteText?: string;
}

/**
 * A reusable delete confirmation modal component
 */
const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onDelete,
  title = "Delete?",
  message = "Are you sure you want to delete this item?",
  cancelText = "Cancel",
  deleteText = "Delete"
}) => {
  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-confirmation-modal"
      aria-describedby="delete-confirmation-dialog"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full mx-4">
          <h2 
            id="delete-confirmation-modal"
            className="text-center text-[#10375c] text-xl font-semibold mb-4"
          >
            {title}
          </h2>
          
          <p className="text-center text-gray-700 mb-6">
            {message}
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 h-12 bg-white border border-[#10375c] rounded-[28px] text-[#10375c] text-sm font-medium"
            >
              {cancelText}
            </button>
            
            <button
              onClick={handleDelete}
              className="flex-1 h-12 bg-[#10375c] rounded-[28px] text-white text-sm font-medium"
            >
              {deleteText}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
