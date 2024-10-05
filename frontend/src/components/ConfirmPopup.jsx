function ConfirmPopup({ message, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "white",
        padding: "20px",
        border: "1px solid black",
        "border-radius": "8px",
        "z-index": 1000,
      }}
    >
      <p style={{ color: "black" }}>{message}</p>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onCancel}>No</button>
    </div>
  );
}

export default ConfirmPopup;
