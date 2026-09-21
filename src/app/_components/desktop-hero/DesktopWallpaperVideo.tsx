"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { withBasePath } from "@/lib/assets";
import { cn } from "@/lib/utils";
import type { IHomeDesktopVideoSource } from "@/types";

type Props = {
  sources: IHomeDesktopVideoSource[];
  /** Where to rest (in seconds) when motion is reduced: the frame with the sky fully formed. */
  stillAt: number;
};

/**
 * The looping wallpaper. It sits over the poster image — which stays the LCP element and
 * the fallback — and fades in once frames are actually flowing, so there is never a blank
 * or frozen first frame. Playback stops while the hero is offscreen or the tab is hidden.
 */
const DesktopWallpaperVideo: React.FC<Props> = ({ sources, stillAt }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (prefersReducedMotion) {
      video.pause();
      const seek = () => (video.currentTime = stillAt);
      if (video.readyState >= 1) seek();
      else video.addEventListener("loadedmetadata", seek, { once: true });
      return () => video.removeEventListener("loadedmetadata", seek);
    }

    let isInView = false;
    const syncPlayback = () => {
      if (isInView && document.visibilityState === "visible") {
        video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isInView = entry?.isIntersecting ?? false;
      syncPlayback();
    });
    observer.observe(video);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, [prefersReducedMotion, stillAt]);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      disablePictureInPicture
      disableRemotePlayback
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setIsVisible(true)}
      onSeeked={() => setIsVisible(true)}
      className={cn(
        "pointer-events-none absolute inset-0 size-full object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      {sources.map(({ src, type, media }) => (
        <source key={src} src={withBasePath(src)} type={type} media={media} />
      ))}
    </video>
  );
};

export default DesktopWallpaperVideo;
