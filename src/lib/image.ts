"use client";

// Client-side image helpers: load a file into an <img>, resize it onto a
// canvas, and read out a JPEG data URL. Keeps uploads small (no server needed).

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function isGif(file: File): boolean {
  return file.type === "image/gif";
}

export function dataUrlKB(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.round((base64.length * 3) / 4 / 1024);
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Not an image"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = String(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function resizeToDataUrl(img: HTMLImageElement, maxSize: number, quality: number): string {
  const ratio = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * ratio));
  const h = Math.max(1, Math.round(img.naturalHeight * ratio));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, w, h);
  }
  return canvas.toDataURL("image/jpeg", quality);
}

export function approxKB(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.round((base64.length * 3) / 4 / 1024);
}

export function resizedDims(img: HTMLImageElement, maxSize: number): string {
  const r = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
  return `${Math.round(img.naturalWidth * r)}×${Math.round(img.naturalHeight * r)}`;
}
