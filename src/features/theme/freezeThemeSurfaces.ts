export const themeSnapshotEvent = "portfolio-theme-snapshot";
export interface ThemeSnapshotRequest {
  capture?: Promise<ImageBitmap | null>;
}

/** OffscreenCanvas textures stay live in Chrome's old view-transition capture. */
export async function freezeThemeSurfaces() {
  const restore: Array<() => void> = [];
  const canvases = Array.from(
    document.querySelectorAll<HTMLCanvasElement>("canvas[data-theme-surface]"),
  );
  await Promise.all(
    canvases.map(async (canvas) => {
      const bounds = canvas.getBoundingClientRect();
      if (
        canvas.dataset.thread !== "worker" ||
        bounds.bottom <= 0 ||
        bounds.top >= innerHeight
      )
        return;
      const detail: ThemeSnapshotRequest = {};
      canvas.dispatchEvent(new CustomEvent(themeSnapshotEvent, { detail }));
      const bitmap = await detail.capture?.catch(() => null);
      if (!bitmap) return;
      if (!canvas.isConnected) {
        bitmap.close();
        return;
      }
      const still = document.createElement("canvas");
      still.width = bitmap.width;
      still.height = bitmap.height;
      const context = still.getContext("2d");
      if (!context) {
        bitmap.close();
        return;
      }
      context.drawImage(bitmap, 0, 0);
      bitmap.close();
      still.dataset.themeSnapshot = "";
      still.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
      const visibility = canvas.style.visibility;
      canvas.parentElement?.appendChild(still);
      canvas.style.visibility = "hidden";
      restore.push(() => {
        canvas.style.visibility = visibility;
        still.remove();
      });
    }),
  );
  return () => {
    restore.splice(0).forEach((release) => release());
  };
}
