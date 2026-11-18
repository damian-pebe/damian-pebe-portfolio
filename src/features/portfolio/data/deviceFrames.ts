import type { DeviceFrame } from "../types/devices";

export const deviceFrames = {
  "browser-window": {
    src: "/mockups/browser-window.svg",
    width: 1536,
    height: 936,
    screens: [
      {
        corners: [
          [12, 66],
          [1524, 66],
          [1524, 924],
          [12, 924],
        ],
        radius: 8,
        primary: true,
      },
    ],
  },
  "fleet-workstation": {
    src: "/mockups/fleet-workstation.webp",
    width: 1536,
    height: 1024,
    screens: [
      {
        corners: [
          [178, 115],
          [1292, 115],
          [1292, 779],
          [178, 779],
        ],
        radius: 4,
        primary: true,
        clip: [
          [178, 115],
          [1292, 115],
          [1292, 339],
          [1241, 339],
          [1210, 345],
          [1191, 364],
          [1183, 390],
          [1183, 779],
          [178, 779],
        ],
      },
      {
        corners: [
          [1197, 349],
          [1460, 349],
          [1460, 928],
          [1197, 928],
        ],
        radius: 42,
        primary: false,
      },
    ],
  },
  "finance-workstation": {
    src: "/mockups/finance-workstation.webp",
    width: 1536,
    height: 1024,
    screens: [
      {
        corners: [
          [229, 89],
          [1424, 89],
          [1424, 717],
          [229, 717],
        ],
        radius: 3,
        primary: true,
        clip: [
          [229, 89],
          [1424, 89],
          [1424, 717],
          [521, 717],
          [516, 684],
          [505, 667],
          [488, 662],
          [229, 658],
        ],
      },
      {
        corners: [
          [113, 673],
          [502, 681],
          [538, 945],
          [144, 953],
        ],
        radius: 13,
        primary: false,
      },
    ],
  },
  "city-command": {
    src: "/mockups/city-command.webp",
    width: 1536,
    height: 1024,
    screens: [
      {
        corners: [
          [397, 286],
          [1141, 286],
          [1141, 646],
          [397, 646],
        ],
        radius: 1,
        primary: true,
      },
      {
        corners: [
          [52, 314],
          [381, 344],
          [381, 646],
          [52, 676],
        ],
        radius: 1,
        primary: false,
      },
      {
        corners: [
          [1156, 343],
          [1485, 313],
          [1485, 676],
          [1156, 647],
        ],
        radius: 1,
        primary: false,
      },
    ],
  },
  "intelligence-laptop": {
    src: "/mockups/intelligence-laptop.webp",
    width: 1536,
    height: 1024,
    screens: [
      {
        corners: [
          [126, 135],
          [975, 156],
          [1041, 690],
          [199, 750],
        ],
        radius: 8,
        primary: true,
      },
    ],
  },
  "spatial-tablet": {
    src: "/mockups/spatial-tablet.webp",
    width: 1672,
    height: 941,
    screens: [
      {
        corners: [
          [208, 54],
          [1157, 103],
          [1352, 690],
          [393, 754],
        ],
        radius: 25,
        primary: true,
      },
    ],
  },
  "creative-studio": {
    src: "/mockups/creative-studio.webp",
    width: 1774,
    height: 887,
    screens: [
      {
        corners: [
          [92, 48],
          [1611, 48],
          [1611, 523],
          [92, 523],
        ],
        radius: 1,
        primary: true,
      },
    ],
  },
  "dual-workstation": {
    src: "/mockups/creative-studio.webp",
    width: 1774,
    height: 887,
    // Two desktop windows share the ultrawide display without cropping either UI.
    screens: [
      {
        corners: [
          [92, 48],
          [844, 48],
          [844, 523],
          [92, 523],
        ],
        radius: 1,
        primary: true,
      },
      {
        corners: [
          [858, 48],
          [1611, 48],
          [1611, 523],
          [858, 523],
        ],
        radius: 1,
        primary: false,
      },
    ],
  },
  "mobile-pair": {
    src: "/mockups/mobile-pair.webp",
    width: 1536,
    height: 1024,
    screens: [
      {
        corners: [
          [286, 90],
          [637, 48],
          [859, 875],
          [466, 980],
        ],
        radius: 55,
        clip: [
          [0, 0],
          [689, 0],
          [689, 1024],
          [0, 1024],
        ],
      },
      {
        corners: [
          [704, 21],
          [1193, 21],
          [1193, 996],
          [704, 996],
        ],
        radius: 80,
        primary: true,
      },
    ],
  },
  "macbook-front": {
    src: "/mockups/macbook-frame.webp",
    width: 1586,
    height: 992,
    screens: [
      {
        corners: [
          [148, 63],
          [1439, 63],
          [1439, 855],
          [148, 855],
        ],
        radius: 12,
        primary: true,
      },
    ],
  },
} satisfies Record<string, DeviceFrame>;

export type DeviceFrameId = keyof typeof deviceFrames;
