// src/pages/Vision.tsx
console.log("VISION LOADED");

import React, { useCallback, useMemo, useState } from "react";
import { Box } from "@mui/material";
import MarksTree from "../components/MarksTree";
import MarkDrawer from "../components/MarkDrawer";
import { MARKS } from "../data/marks";

const Vision: React.FC = () => {
  const [selectedMark, setSelectedMark] = useState<
    typeof MARKS[number] | null
  >(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Viewer URL (iframe reloads on change)
  const [viewerUrl, setViewerUrl] = useState(
    "https://my.matterport.com/show/?m=BGfbBBXhrZf&play=1"
  );

  const handleSelectMark = useCallback((mark: typeof MARKS[number]) => {
    setSelectedMark(mark);
    setDrawerOpen(true);

    if (mark.cameraUrl) {
      // Force reload every time
      const forced = `${mark.cameraUrl}&ts=${Date.now()}`;
      setViewerUrl(forced);
    }
  }, []);

  const viewer = useMemo(
    () => (
      <iframe
        key={viewerUrl}
        src={viewerUrl}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        allow="fullscreen; xr-spatial-tracking"
      />
    ),
    [viewerUrl]
  );

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        bgcolor: "#020617",
        color: "white",
      }}
    >
      <MarksTree
        selectedMarkId={selectedMark?.id || null}
        onSelectMark={handleSelectMark}
      />

      <Box
        sx={{
          flexGrow: 1,
          position: "relative",
          bgcolor: "black",
        }}
      >
        {viewer}
      </Box>

      <MarkDrawer
        open={drawerOpen}
        mark={selectedMark}
        onClose={() => setDrawerOpen(false)}
      />
    </Box>
  );
};

export default Vision;
