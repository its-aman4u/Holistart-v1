import { useState, useEffect } from "react";

export default function LoadingOverlay() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleShowLoading = () => setIsVisible(true);
    const handleHideLoading = () => setIsVisible(false);

    window.addEventListener("show-loading", handleShowLoading);
    window.addEventListener("hide-loading", handleHideLoading);

    return () => {
      window.removeEventListener("show-loading", handleShowLoading);
      window.removeEventListener("hide-loading", handleHideLoading);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-4 flex items-center gap-3" data-testid="loading-overlay">
        <div className="loading-spinner"></div>
        <span className="text-foreground">Processing...</span>
      </div>
    </div>
  );
}

export const showLoading = () => {
  window.dispatchEvent(new CustomEvent("show-loading"));
};

export const hideLoading = () => {
  window.dispatchEvent(new CustomEvent("hide-loading"));
};
