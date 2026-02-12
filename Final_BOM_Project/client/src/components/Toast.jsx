import { useEffect } from "react";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        padding: "12px 16px",
        borderRadius: 8,
        color: "#fff",
        background:
          type === "success"
            ? "#22c55e"
            : type === "error"
            ? "#ef4444"
            : "#3b82f6",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        zIndex: 9999,
        minWidth: 220,
      }}
    >
      {message}
    </div>
  );
}

export default Toast;
