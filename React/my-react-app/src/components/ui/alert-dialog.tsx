// src/components/ui/alert-dialog.tsx
import { Dialog } from '@headlessui/react';
import React, { useState } from 'react';

type AlertDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
};

export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <Dialog.Title className="text-xl font-semibold text-gray-900">{title}</Dialog.Title>
          <Dialog.Description className="mt-2 text-gray-600">{description}</Dialog.Description>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose(); // Close dialog after confirming
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg focus:outline-none"
            >
              Confirm
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
