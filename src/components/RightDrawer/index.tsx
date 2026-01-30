import { useEffect, useState } from "react";

export default function RightDrawer({ mpSdk, selected, activeTab }) {
  const [media, setMedia] = useState([]);
  const [events, setEvents] = useState([]);
  const [maintenance, setMaintenance] = useState([]);

  // Auto-load placeholder content when a mark is selected
  useEffect(() => {
    if (!mpSdk) return;

    if (selected) {
      setMedia([
        { id: 1, type: "photo", name: "Machine Close-up" },
        { id: 2, type: "video", name: "Maintenance Walkthrough" },
        { id: 3, type: "doc", name: "Spec Sheet.pdf" },
      ]);

      setEvents([
        { id: 1, title: "Inspection Completed", date: "2025-01-12" },
        { id: 2, title: "Calibration Scheduled", date: "2025-02-03" },
      ]);

      setMaintenance([
        { id: 1, task: "Lubricate bearings", status: "Pending" },
        { id: 2, task: "Replace filter", status: "Completed" },
      ]);
    } else {
      // Empty state when no mark is selected
      setMedia([]);
      setEvents([]);
      setMaintenance([]);
    }
  }, [mpSdk, selected]);

  const renderMedia = () => (
    <div style={{ padding: 16 }}>
      {media.length === 0 && <div>No media assigned.</div>}
      {media.map((m) => (
        <div
          key={m.id}
          style={{
            padding: "10px 12px",
            background: "#141414",
            border: "1px solid #222",
            borderRadius: 6,
            marginBottom: 10,
          }}
        >
          <strong>{m.name}</strong>
          <div style={{ opacity: 0.6, fontSize: 12 }}>{m.type}</div>
        </div>
      ))}
    </div>
  );

  const renderEvents = () => (
    <div style={{ padding: 16 }}>
      {events.length === 0 && <div>No events logged.</div>}
      {events.map((e) => (
        <div
          key={e.id}
          style={{
            padding: "10px 12px",
            background: "#141414",
            border: "1px solid #222",
            borderRadius: 6,
            marginBottom: 10,
          }}
        >
          <strong>{e.title}</strong>
          <div style={{ opacity: 0.6, fontSize: 12 }}>{e.date}</div>
        </div>
      ))}
    </div>
  );

  const renderMaintenance = () => (
    <div style={{ padding: 16 }}>
      {maintenance.length === 0 && <div>No maintenance tasks.</div>}
      {maintenance.map((m) => (
        <div
          key={m.id}
          style={{
            padding: "10px 12px",
            background: "#141414",
            border: "1px solid #222",
            borderRadius: 6,
            marginBottom: 10,
          }}
        >
          <strong>{m.task}</strong>
          <div style={{ opacity: 0.6, fontSize: 12 }}>{m.status}</div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "media":
        return renderMedia();
      case "events":
        return renderEvents();
      case "maintenance":
        return renderMaintenance();
      default:
        return renderMedia();
    }
  };

  return (
    <div
      style={{
        width: 320,
        background: "#0f0f0f",
        borderLeft: "1px solid #222",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 15,
        position: "relative",
      }}
    >
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #222",
          background: "#111",
        }}
      >
        {["media", "events", "maintenance"].map((tab) => (
          <div
            key={tab}
            style={{
              flex: 1,
              padding: "12px 0",
              textAlign: "center",
              cursor: "pointer",
              background: activeTab === tab ? "#1a1a1a" : "transparent",
              borderBottom:
                activeTab === tab ? "2px solid #4da3ff" : "2px solid transparent",
              transition: "0.15s",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>{renderContent()}</div>
    </div>
  );
}
