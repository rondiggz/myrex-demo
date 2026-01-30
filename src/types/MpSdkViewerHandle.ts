// src/types/MpSdkViewerHandle.ts

export type MpSdkViewerHandle = {
  jumpToPose: (pose: {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
  }) => void;
};
