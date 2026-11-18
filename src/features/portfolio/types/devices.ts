export type ScreenPoint = [number, number];
export type ScreenCorners = [
  ScreenPoint,
  ScreenPoint,
  ScreenPoint,
  ScreenPoint,
];
export interface DeviceFrame {
  src: string;
  width: number;
  height: number;
  screens: {
    corners: ScreenCorners;
    radius: number;
    primary?: boolean;
    clip?: ScreenPoint[];
  }[];
}
