"use client";

import { useEffect, useRef } from "react";
import { createDotField } from "./dotfield.core.js";
import type { DotFieldHandle, DotFieldOptions } from "./dotfield.core.js";

export type DotFieldProps = Partial<DotFieldOptions> & {
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Ambient background: a slowly reorganising field of blocky forms resolved into
 * 1-bit dots by an ordered dither. Neutral at rest. Near the pointer the dots
 * take the brand blue, the block lattice shifts toward the cursor, and a set of
 * detection boxes with coordinate readouts fades in.
 *
 * The host is `pointer-events: none`, so it sits behind page content without
 * stealing clicks — it reads the pointer off `window` instead. The parent must
 * be positioned.
 *
 *   <div style={{ position: 'relative' }}>
 *     <DotField />
 *     <YourContent />
 *   </div>
 */
export default function WorkShader({ className, style, ...options }: DotFieldProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<DotFieldHandle | null>(null);

  // Latest options, readable from the mount effect without making it a dep.
  const optionsRef = useRef(options);

  // Mount once. Prop changes go through setOptions below, so nothing ever
  // tears down and rebuilds the GL context.
  useEffect(() => {
    if (!hostRef.current) return;
    const field = createDotField(hostRef.current, optionsRef.current);
    handleRef.current = field;
    return () => {
      field.destroy();
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
        background: "#FFFFFF",
        ...style,
      }}
    />
  );
}
