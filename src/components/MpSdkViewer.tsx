// src/components/MpSdkViewer.tsx

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  useState,
} from "react";

type Pose = {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
};

type MpSdkViewerProps = {
  modelId: string;
  onSdkReady?: (mpSdk: any) => void;
};

const MpSdkViewer = React.forwardRef((props: MpSdkViewerProps, ref) => {
  const { modelId, onSdkReady } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [mpSdk, setMpSdk] = useState<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load the Matterport SDK bundle (non-iframe)
    const script = document.createElement("script");
    script.src = "https://static.matterport.com/showcase-sdk/3.0.1/sdk.js";

    script.onload = async () => {
      const sdk = await (window as any).MP_SDK.connect(
        containerRef.current,
        modelId,
        {
          iframe: false, // ⭐ THIS IS THE KEY — NO IFRAME
        }
      );

      setMpSdk(sdk);
      onSdkReady && onSdkReady(sdk);
    };

    document.body.appendChild(script);
  }, [modelId, onSdkReady]);

  useImperativeHandle(ref, () => ({
    jumpToPose: (pose: Pose) => {
      if (!mpSdk) return;
      mpSdk.Camera.setPose(pose, { transition: "fly" });
    },
  }));

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: "black",
      }}
    />
  );
});

export default MpSdkViewer;
