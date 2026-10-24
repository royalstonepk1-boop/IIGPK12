
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export default function CertificateImageModal({
  imageUrl,
  certificateNumber,
  onClose,
}) {
  useEffect(() => {
    if (!imageUrl) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [imageUrl, onClose]);

  if (!imageUrl) return null;


  return createPortal(
    <div
      className="fixed inset-0 z-[99999] bg-black/100 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image"
        className="absolute top-4 right-5 text-white text-4xl leading-none hover:text-red-400"
      >
        &times;
      </button>
  
      <div
        className="flex flex-col items-center max-w-full max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {certificateNumber && (
          <p className="text-white text-sm sm:text-base font-semibold mb-3">
            Certificate No: {certificateNumber}
          </p>
        )}
  
        <img
          src={imageUrl}
          alt={`Certificate ${certificateNumber || ""}`}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>,
    document.body
  );
  
}
