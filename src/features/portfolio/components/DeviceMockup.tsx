import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { deviceFrames } from "../data/deviceFrames";
import { getProjectScene } from "../data/projectScenes";
import { gallery, thumbnail, type Project } from "../data/projects";
import type { DeviceFrame } from "../types/devices";
import { screenProjection } from "../utils/screenProjection";

export function DeviceMockup({
  project,
  slide = 0,
  priority = false,
  detail = false,
  alt = "",
}: {
  project: Project;
  slide?: number;
  priority?: boolean;
  detail?: boolean;
  alt?: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const frameId = getProjectScene(project.id, slide + 1).frameId;
  const frame: DeviceFrame = deviceFrames[frameId];
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  if (!project.second) {
    return (
      <Image
        className="concept-visual"
        src={gallery(project)[0]}
        alt={alt}
        width={1600}
        height={1000}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }
  const images = gallery(project);
  return (
    <div
      ref={container}
      className="device-mockup"
      data-mockup={frameId}
      style={
        {
          aspectRatio: `${frame.width} / ${frame.height}`,
          "--device-ratio": frame.width / frame.height,
        } as CSSProperties
      }
    >
      <Image
        className="device-frame"
        src={frame.src}
        alt=""
        width={frame.width}
        height={frame.height}
        loading={priority ? "eager" : "lazy"}
      />
      {width > 0 &&
        frame.screens.map((screen, index) => {
          const scale = width / frame.width;
          const primary = !!screen.primary;
          const src =
            detail || index > 0 || slide > 0
              ? images[(slide + (primary ? 0 : index)) % images.length]
              : thumbnail(project);
          return (
            <div
              key={index}
              className="device-plane"
              style={{
                clipPath: screen.clip
                  ? `polygon(${screen.clip.map(([x, y]) => `${(x / frame.width) * 100}% ${(y / frame.height) * 100}%`).join(",")})`
                  : undefined,
              }}
              aria-hidden={!primary || undefined}
            >
              <div
                className="device-display"
                style={{
                  ...screenProjection(screen.corners, scale),
                  borderRadius: screen.radius * scale,
                }}
              >
                <Image
                  className="device-capture"
                  src={src}
                  alt={primary ? alt : ""}
                  width={1600}
                  height={1000}
                  style={{ objectPosition: project.position }}
                  loading={priority ? "eager" : "lazy"}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}
