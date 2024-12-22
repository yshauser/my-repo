import { useState } from 'react';

const MyModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        onClick={openModal}
      >
        Open Modal
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-semibold">This is a Modal</h2>
            <p className="mt-4">You can put content here</p>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
