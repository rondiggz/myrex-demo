import { useEffect, useState } from "react";

export default function RightDrawer({ mpSdk, selected }) {
  const [mark, setMark] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("details");

  // Load mark data when selection changes
  useEffect(() => {
    if (!mpSdk || !selected) return;

    const sub = mpSdk.Tag.data.subscribe((tags: any[]) => {
      const found = tags.find((t) => t.sid === selected);
      if (found) setMark(found);
    });

    return () => sub?.cancel?.();
  }, [mpSdk, selected]);

  if (!mark) {
    return (
      <div
        style={{
          width: 340,
          height: "100%",
          background: "#0f0f0f",
          color: "#fff",
          borderLeft: "1px solid #222",
          padding: 20,
          opacity: 0.4,
        }}
      >
        Select a mark to view details
      </div>
    );
  }

  return (
    <div
      style={{
        width: 340,
        height: "100%",
        background: "#0f0f0f",
        color: "#fff",
        borderLeft: "1px solid #222",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 20px 10px 20px",
          borderBottom: "1px solid #222",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20 }}>{mark.label}</h2>
        <div style={{ opacity: 0.6, fontSize: 14 }}>{mark.category}</div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #222",
        }}
      >
        {["details", "media", "events", "activity"].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "12px 0",
              textAlign: "center",
              cursor: "pointer",
              background: activeTab === tab ? "#1a1a1a" : "#0f0f0f",
              borderBottom:
                activeTab === tab ? "2px solid #4da3ff" : "2px solid transparent",
              transition: "0.2s",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
        {activeTab === "details" && (
          <div>
            <h3 style={{ marginBottom: 10 }}>Details</h3>
            <div style={{ opacity: 0.8 }}>
              <div><strong>ID:</strong> {mark.sid}</div>
              <div><strong>Label:</strong> {mark.label}</div>
              <div><strong>Category:</strong> {mark.category}</div>
              <div><strong>Type:</strong> {mark.type}</div>
            </div>
          </div>
        )}

        {activeTab === "media" && (
          <div>
            <h3 style={{ marginBottom: 10 }}>Media</h3>
            <div style={{ opacity: 0.6 }}>No media attached yet</div>
          </div>
        )}

        {activeTab === "events" && (
          <div>
            <h3 style={{ marginBottom: 10 }}>Events</h3>
            <div style={{ opacity: 0.6 }}>No events recorded</div>
          </div>
        )}

        {activeTab === "activity" && (
          <div>
            <h3 style={{ marginBottom: 10 }}>Activity</h3>
            <div style={{ opacity: 0.6 }}>No activity logged</div>
          </div>
        )}
      </div>
    </div>
  );
}
