import React from "react";
import { useRouter } from "next/navigation";

interface PopupProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  redirectTo: string;
}

const Popup: React.FC<PopupProps> = ({ message, isOpen, onClose, redirectTo }) => {
  const router = useRouter();

  const handleClose = () => {
    onClose();
    router.push(redirectTo);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300 ease-in-out">
      <div className="bg-white p-8 rounded-lg shadow-2xl transform scale-95 hover:scale-100 transition-transform duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Notification</h2>
          <p className="mt-4 text-gray-600">{message}</p>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleClose}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg shadow-md font-medium tracking-wide transition-all duration-300"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
