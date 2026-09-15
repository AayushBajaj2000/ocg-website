"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { PauseIcon, PlayIcon } from "@/components/icons";
import { withBasePath } from "@/lib/assets";
import { cn } from "@/lib/utils";
import type { IVideo } from "@/types";

type Props = IVideo & {
  label: string;
  className?: string;
};

type PlaybackChoice = "play" | "pause" | null;

const VISIBILITY_THRESHOLD = 0.25;

const AutoplayVideo: React.FC<Props> = ({ sources, width, height, poster, label, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [choice, setChoice] = useState<PlaybackChoice>(null);
  const prefersReducedMotion = useReducedMotion();

  const shouldPlay = choice === null ? !prefersReducedMotion : choice === "play";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!shouldPlay) {
      video.pause();
      return;
    }

    let isInView = false;

    const syncPlayback = () => {
      if (isInView && document.visibilityState === "visible") {
        video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry?.isIntersecting ?? false;
        syncPlayback();
      },
      { threshold: VISIBILITY_THRESHOLD },
    );

    observer.observe(video);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, [shouldPlay]);

  return (
    <div
      className={cn("group relative w-full overflow-hidden bg-neutral-100", className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {!isReady && (
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-neutral-200 motion-reduce:animate-none"
        />
      )}
      <video
        ref={videoRef}
        width={width}
        height={height}
        poster={poster && withBasePath(poster)}
        muted
        loop
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        preload={shouldPlay ? "none" : "metadata"}
        aria-hidden="true"
        tabIndex={-1}
        onLoadedData={() => setIsReady(true)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className={cn(
          "absolute inset-0 size-full object-cover transition-opacity duration-300 ease-out motion-reduce:transition-none",
          isReady ? "opacity-100" : "opacity-0",
        )}
      >
        {sources.map((source) => (
          <source key={source.src} src={withBasePath(source.src)} type={source.type} />
        ))}
      </video>
      <button
        type="button"
        onClick={() => setChoice(shouldPlay ? "pause" : "play")}
        aria-label={`${shouldPlay ? "Pause" : "Play"} ${label} video`}
        className={cn(
          "border-hairline focus-visible:outline-brand-blue absolute right-3 bottom-3 grid size-10 cursor-pointer place-items-center border bg-white text-neutral-900 transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none [@media(hover:none)]:opacity-100",
          isPlaying ? "opacity-0" : "opacity-100",
        )}
      >
        {shouldPlay ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
      </button>
    </div>
  );
};

export default AutoplayVideo;
