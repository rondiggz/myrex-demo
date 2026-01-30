export default function BottomBar({ setActiveTab }) {
  const buttons = [
    { label: "Media", tab: "media" },
    { label: "Events", tab: "events" },
    { label: "Maintenance", tab: "maintenance" },
    { label: "IoT", tab: null },
    { label: "Support", tab: null },
    { label: "Settings", tab: null },
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 12,
        background: "#0f0f0f",
        padding: "10px 16px",
        borderRadius: 12,
        border: "1px solid #222",
        zIndex: 10,
      }}
    >
      {buttons.map((btn, i) => (
        <div
          key={i}
          onClick={() => btn.tab && setActiveTab(btn.tab)}
          style={{
            padding: "8px 14px",
            borderRadius: 6,
            background: "#141414",
            border: "1px solid #333",
            color: "#fff",
            cursor: btn.tab ? "pointer" : "default",
            opacity: btn.tab ? 1 : 0.4,
            fontSize: 14,
          }}
        >
          {btn.label}
        </div>
      ))}
    </div>
  );
}
