"use client";

import { useEffect, useRef } from "react";
import { createBuildingAscii } from "./buildingAscii.core.js";
import type { BuildingAsciiHandle, BuildingAsciiOptions } from "./buildingAscii.core.js";

export type BuildingShaderProps = Partial<BuildingAsciiOptions> & {
  className?: string;
  style?: React.CSSProperties;
};

export default function BuildingShader({ className, style, ...options }: BuildingShaderProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<BuildingAsciiHandle | null>(null);

  // Latest options, readable from the mount effect without making it a dep.
  const optionsRef = useRef(options);

  // Mount once. Prop changes go through setOptions below, so nothing ever
  // tears down and rebuilds the GL context.
  useEffect(() => {
    if (!hostRef.current) return;
    const art = createBuildingAscii(hostRef.current, optionsRef.current);
    handleRef.current = art;
    return () => {
      art.destroy();
      handleRef.current = null;
    };
  }, []);

  useEffect(() => {
    optionsRef.current = options;
    handleRef.current?.setOptions(options);
  });

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
