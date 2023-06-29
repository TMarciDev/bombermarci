import { useEffect } from "react";
import { toast } from "react-toastify";

const CopyButton = ({ text }: { text: string }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast.success("Room code copied to clickboard");
  };

  useEffect(() => {
    navigator.clipboard.writeText(text);
    toast.success("Succesful connection! Room code copied to clickboard");
  }, [text]);

  return (
    <div style={{ display: "inline-block" }}>
      <button
        onClick={copyToClipboard}
        style={{
          width: "60px",
          height: "60px",
          background: "none",
          border: "none",
          cursor: "pointer",
          marginRight: "20px",
        }}
      >
        📋
      </button>
    </div>
  );
};

export default CopyButton;
