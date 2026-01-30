// src/components/MarksTree.tsx

import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Chip,
  Divider,
} from "@mui/material";
import { MARKS, MARK_CATEGORIES } from "../data/marks";
import SearchIcon from "@mui/icons-material/Search";

type MarksTreeProps = {
  selectedMarkId?: string | null;
  onSelectMark: (mark: typeof MARKS[number]) => void;
};

const MarksTree: React.FC<MarksTreeProps> = React.memo(
  ({ selectedMarkId, onSelectMark }) => {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("all");

    // Stable click handler
    const handleClick = useCallback(
      (mark: typeof MARKS[number]) => {
        onSelectMark(mark);
      },
      [onSelectMark]
    );

    const filteredMarks = useMemo(() => {
      return MARKS.filter((m) => {
        const matchesCategory =
          activeCategory === "all" || m.category === activeCategory;
        const matchesSearch =
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          (m.station || "").toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      });
    }, [search, activeCategory]);

    return (
      <Box
        sx={{
          width: 320,
          bgcolor: "#111827",
          color: "white",
          p: 2,
          overflowY: "auto",
          borderRight: "1px solid #1f2937",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* HEADER */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: "#9CA3AF", mb: 0.5 }}>
            MYREX VISION
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            ASSET MARKS
          </Typography>
        </Box>

        {/* SEARCH BAR */}
        <Box sx={{ position: "relative" }}>
          <SearchIcon
            sx={{
              position: "absolute",
              top: "50%",
              left: 10,
              transform: "translateY(-50%)",
              color: "#6B7280",
              fontSize: 20,
            }}
          />
          <TextField
            fullWidth
            placeholder="Search marks, stations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#0f172a",
                color: "white",
                pl: 4,
                borderRadius: 2,
                "& fieldset": { borderColor: "#1f2937" },
                "&:hover fieldset": { borderColor: "#374151" },
                "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
              },
            }}
          />
        </Box>

        {/* CATEGORY FILTER CHIPS */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Chip
            label="All"
            onClick={() => setActiveCategory("all")}
            color={activeCategory === "all" ? "primary" : "default"}
            sx={{
              bgcolor: activeCategory === "all" ? "#3b82f6" : "#1f2937",
              color: "white",
              "&:hover": { bgcolor: "#374151" },
            }}
          />
          {MARK_CATEGORIES.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.label}
              onClick={() => setActiveCategory(cat.id)}
              sx={{
                bgcolor:
                  activeCategory === cat.id
                    ? cat.color
                    : "rgba(255,255,255,0.08)",
                color: "white",
                "&:hover": { opacity: 0.8 },
              }}
            />
          ))}
        </Box>

        <Divider sx={{ borderColor: "#1f2937" }} />

        {/* MARK LIST */}
        <List dense disablePadding>
          {filteredMarks.map((mark) => (
            <ListItemButton
              key={mark.id}
              selected={mark.id === selectedMarkId}
              onClick={() => handleClick(mark)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                transition: "0.15s",
                "&.Mui-selected": {
                  bgcolor: "#1e293b",
                  borderLeft: "3px solid #3b82f6",
                },
                "&:hover": {
                  bgcolor: "#1f2937",
                },
              }}
            >
              <ListItemText
                primary={mark.name}
                secondary={mark.station}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "white",
                }}
                secondaryTypographyProps={{
                  fontSize: 12,
                  color: "#9CA3AF",
                }}
              />
            </ListItemButton>
          ))}

          {filteredMarks.length === 0 && (
            <Typography
              sx={{ color: "#6B7280", fontSize: 14, mt: 2, textAlign: "center" }}
            >
              No marks found.
            </Typography>
          )}
        </List>
      </Box>
    );
  }
);

export default MarksTree;
