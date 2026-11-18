import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { deviceFrames } from "../data/deviceFrames";
import { getProjectScene } from "../data/projectScenes";
import {
  gallery,
  galleryPreview,
  thumbnail,
  type Project,
} from "../data/projects";
import type { DeviceFrame } from "../types/devices";
import { screenProjection } from "../utils/screenProjection";
import { CaptureImage } from "./CaptureImage";

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
      <CaptureImage
        className="concept-visual"
        sources={{
          light: detail
            ? gallery(project, "light")[0]
            : thumbnail(project, "light", !priority),
          dark: detail
            ? gallery(project, "dark")[0]
            : thumbnail(project, "dark", !priority),
        }}
        alt={alt}
        width={1600}
        height={1000}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
      />
    );
  }
  const images = {
    light: gallery(project, "light"),
    dark: gallery(project, "dark"),
  };
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
        fetchPriority={priority ? "high" : undefined}
      />
      {width > 0 &&
        frame.screens.map((screen, index) => {
          const scale = width / frame.width;
          const primary = !!screen.primary;
          const imageIndex =
            (slide + (primary ? 0 : index)) % images.light.length;
          const sources = {
            light: detail
              ? images.light[imageIndex]
              : index > 0 || slide > 0
                ? galleryPreview(project, imageIndex, "light")
                : thumbnail(project, "light", !priority),
            dark: detail
              ? images.dark[imageIndex]
              : index > 0 || slide > 0
                ? galleryPreview(project, imageIndex, "dark")
                : thumbnail(project, "dark", !priority),
          };
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
                <CaptureImage
                  className="device-capture"
                  sources={sources}
                  alt={primary ? alt : ""}
                  width={1600}
                  height={1000}
                  style={{
                    objectPosition:
                      project.captures?.[imageIndex]?.position ??
                      project.position,
                  }}
                  loading={priority ? "eager" : "lazy"}
                  fetchPriority={priority && primary ? "high" : undefined}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}
