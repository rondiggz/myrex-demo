// src/components/MarkDrawer.tsx

import React from "react";
import {
  Box,
  Drawer,
  Tabs,
  Tab,
  Typography,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import PhotoIcon from "@mui/icons-material/Photo";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import DescriptionIcon from "@mui/icons-material/Description";
import EventIcon from "@mui/icons-material/Event";
import BuildIcon from "@mui/icons-material/Build";
import TimelineIcon from "@mui/icons-material/Timeline";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { MARKS } from "../data/marks";

type MarkDrawerProps = {
  open: boolean;
  mark: typeof MARKS[number] | null;
  onClose: () => void;
};

const CATEGORY_COLORS: Record<string, string> = {
  marketing: "#3b82f6",
  maintenance: "#f97316",
};

const MarkDrawer: React.FC<MarkDrawerProps> = ({
  open,
  mark,
  onClose,
}) => {
  const [tabIndex, setTabIndex] = React.useState(0);

  React.useEffect(() => {
    setTabIndex(0);
  }, [mark?.id]);

  if (!mark) {
    return (
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 380, height: "100%", bgcolor: "#020617", p: 3 }}>
          <Typography>Select a mark to view details.</Typography>
        </Box>
      </Drawer>
    );
  }

  const categoryColor = CATEGORY_COLORS[mark.category] || "#6B7280";

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 380,
          height: "100%",
          bgcolor: "#020617",
          color: "white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <Box sx={{ p: 2, borderBottom: "1px solid #1f2933" }}>
          <Typography variant="subtitle2" sx={{ color: "#9CA3AF", mb: 0.5 }}>
            {mark.station}
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {mark.name}
          </Typography>

          <Chip
            label={mark.category.toUpperCase()}
            size="small"
            sx={{
              mt: 1,
              bgcolor: categoryColor + "22",
              color: categoryColor,
              fontWeight: 600,
            }}
          />
        </Box>

        {/* TABS */}
        <Tabs
          value={tabIndex}
          onChange={(_, i) => setTabIndex(i)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: "1px solid #1f2933",
            px: 1,
            "& .MuiTab-root": { fontSize: 12, minWidth: 90 },
          }}
        >
          <Tab icon={<PhotoIcon />} label="Media" />
          <Tab icon={<EventIcon />} label="Events" />
          <Tab icon={<BuildIcon />} label="Maintenance" />
          <Tab icon={<TimelineIcon />} label="Activity" />
          <Tab icon={<SupportAgentIcon />} label="Support" />
        </Tabs>

        {/* CONTENT */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          {tabIndex === 0 && (
            <Box>
              {/* Photos */}
              <Typography sx={{ color: "#9CA3AF", mb: 1, fontWeight: 600 }}>
                Photos ({mark.content.photos.length})
              </Typography>

              <Grid container spacing={1} sx={{ mb: 2 }}>
                {mark.content.photos.map((url, idx) => (
                  <Grid item xs={6} key={idx}>
                    <img
                      src={url}
                      style={{
                        width: "100%",
                        borderRadius: 6,
                        objectFit: "cover",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Videos */}
              <Typography sx={{ color: "#9CA3AF", mb: 1, fontWeight: 600 }}>
                Videos ({mark.content.videos.length})
              </Typography>

              <Grid container spacing={1} sx={{ mb: 2 }}>
                {mark.content.videos.map((url, idx) => (
                  <Grid item xs={12} key={idx}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <VideoLibraryIcon
                        sx={{ color: "#60A5FA", mr: 1, fontSize: 18 }}
                      />
                      <Typography sx={{ fontSize: 13, color: "#E5E7EB" }}>
                        Video {idx + 1}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Documents */}
              <Typography sx={{ color: "#9CA3AF", mb: 1, fontWeight: 600 }}>
                Documents ({mark.content.documents.length})
              </Typography>

              <List dense>
                {mark.content.documents.map((url, idx) => (
                  <ListItem key={idx} disableGutters>
                    <DescriptionIcon
                      sx={{ color: "#60A5FA", mr: 1, fontSize: 18 }}
                    />
                    <ListItemText
                      primaryTypographyProps={{ fontSize: 13 }}
                      primary={url}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {tabIndex !== 0 && (
            <Typography sx={{ color: "#6B7280" }}>
              Coming soon.
            </Typography>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default MarkDrawer;
