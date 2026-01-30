export default function TopBar() {
  return (
    <div
      style={{
        width: "100%",
        height: 60,
        background: "#0f0f0f",
        borderBottom: "1px solid #222",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        color: "#fff",
        fontSize: 16,
        fontWeight: 500,
        zIndex: 20,
        position: "relative",
      }}
    >
      {/* Left: App Title */}
      <div style={{ fontWeight: 600 }}>MYREX VISION</div>

      {/* Center: Search */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Search assets, events, or locations..."
          style={{
            width: "60%",
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #333",
            background: "#141414",
            color: "#fff",
            outline: "none",
          }}
        />
      </div>

      {/* Right: Notifications + User */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 24,
            height: 24,
            background: "#1a1a1a",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #333",
            cursor: "pointer",
          }}
        >
          🔔
        </div>

        <div
          style={{
            width: 32,
            height: 32,
            background: "#1a1a1a",
            borderRadius: "50%",
            border: "1px solid #333",
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
}
