/**
 * Base Modal Component
 * Reusable modal wrapper for all auth popups
 */

import React from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  closeButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  children,
  onClose,
  closeButton = true,
}) => {
  const { closeModal, modal } = useAuth();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      closeModal();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          {closeButton && (
            <div className="flex justify-end p-4 border-b border-gray-200">
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Content */}
          <div className="p-6">{children}</div>

          {/* Error Message */}
          {modal.error && (
            <div className="px-6 pb-4">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {modal.error}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
