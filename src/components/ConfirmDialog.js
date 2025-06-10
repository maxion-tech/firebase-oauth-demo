import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import React from 'react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  type = 'warning', // 'warning', 'danger'
}) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Dialog container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-2xl w-full rounded-lg bg-[#282a36] border border-customGrayLight p-6 shadow-xl">
          {/* Icon and Title */}
          <div className="flex items-center space-x-4 mb-4">
            <FontAwesomeIcon
              icon={faQuestionCircle}
              className={`text-4xl ${
                type === 'danger' ? 'text-red-500' : 'text-yellow-500'
              }`}
            />
            <div>
              {title && (
                <DialogTitle className="text-lg font-semibold text-white">
                  {title}
                </DialogTitle>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="mb-6">
            <p className="text-customGrayLight leading-relaxed">{message}</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#3f3f3f] text-white hover:bg-[#4f4f4f] transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                type === 'danger'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-primary hover:bg-opacity-90 text-black'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
