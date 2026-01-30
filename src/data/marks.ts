// src/data/marks.ts

export const MARK_CATEGORIES = [
  { id: "marketing", label: "Marketing", color: "#3b82f6" },
  { id: "maintenance", label: "Maintenance", color: "#f97316" },
];

export const MARKS = [
  {
    id: "station3-auto-injector",
    name: "Station 3 – Auto Injector",
    station: "Station 3",
    category: "marketing",

    // SDK pose (placeholder until we extract exact values)
    pose: {
      position: { x: 2.11, y: 1.45, z: -3.22 },
      rotation: { x: 0, y: 1.28, z: 0 },
    },

    content: {
      photos: [
        // "https://example.com/photo1.jpg"
      ],
      videos: [
        // "https://example.com/video1.mp4"
      ],
      documents: [
        // "https://example.com/manual.pdf"
      ],
    },
  },

  // Add more marks here as needed...
];
