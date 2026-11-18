import type { DeviceFrameId } from "./deviceFrames";

/** Each product has an art direction and a sequence of complementary devices. */
const scenes: Record<
  string,
  { frames: DeviceFrameId[]; tone: string; composition: string }
> = {
  omnicube: {
    frames: [
      "macbook-front",
      "intelligence-laptop",
      "dual-workstation",
      "spatial-tablet",
      "finance-workstation",
      "city-command",
    ],
    tone: "#7aada0",
    composition: "fleet",
  },
  fiscalite: {
    frames: [
      "finance-workstation",
      "macbook-front",
      "intelligence-laptop",
      "creative-studio",
      "spatial-tablet",
      "city-command",
    ],
    tone: "#849ac4",
    composition: "finance",
  },
  neurocity: {
    frames: [
      "city-command",
      "intelligence-laptop",
      "dual-workstation",
      "spatial-tablet",
      "macbook-front",
      "finance-workstation",
    ],
    tone: "#948cb2",
    composition: "command",
  },
  agentos: {
    frames: [
      "intelligence-laptop",
      "macbook-front",
      "finance-workstation",
      "dual-workstation",
      "spatial-tablet",
      "city-command",
    ],
    tone: "#ada0c2",
    composition: "intelligence",
  },
  opticore: {
    frames: ["macbook-front", "intelligence-laptop", "spatial-tablet"],
    tone: "#8ab0b5",
    composition: "spatial",
  },
  gemelo: {
    frames: [
      "finance-workstation",
      "macbook-front",
      "dual-workstation",
      "spatial-tablet",
      "intelligence-laptop",
      "city-command",
    ],
    tone: "#b1a6bf",
    composition: "panoramic",
  },
  constella: {
    frames: [
      "finance-workstation",
      "intelligence-laptop",
      "dual-workstation",
      "macbook-front",
      "spatial-tablet",
      "city-command",
    ],
    tone: "#9b9fbb",
    composition: "editorial",
  },
  "clyra-meet": {
    frames: [
      "macbook-front",
      "finance-workstation",
      "spatial-tablet",
      "intelligence-laptop",
    ],
    tone: "#90a4b5",
    composition: "meeting",
  },
  workspace: {
    frames: [
      "intelligence-laptop",
      "macbook-front",
      "dual-workstation",
      "spatial-tablet",
      "finance-workstation",
      "city-command",
    ],
    tone: "#c5ab90",
    composition: "workspace",
  },
  rook: {
    frames: [
      "intelligence-laptop",
      "macbook-front",
      "dual-workstation",
      "finance-workstation",
      "spatial-tablet",
      "city-command",
    ],
    tone: "#a2ad8b",
    composition: "focus",
  },
  omnios: {
    frames: [
      "dual-workstation",
      "macbook-front",
      "spatial-tablet",
      "finance-workstation",
    ],
    tone: "#88a2ba",
    composition: "broadcast",
  },
  kioskos: {
    frames: [
      "intelligence-laptop",
      "macbook-front",
      "finance-workstation",
      "spatial-tablet",
    ],
    tone: "#a09abc",
    composition: "kiosk",
  },
  citytrip: {
    frames: ["mobile-pair", "macbook-front", "spatial-tablet"],
    tone: "#b7a18c",
    composition: "journey",
  },
  teddy: {
    frames: ["spatial-tablet", "mobile-pair", "intelligence-laptop"],
    tone: "#bd9f8d",
    composition: "companion",
  },
  medadvisor: {
    frames: [
      "macbook-front",
      "finance-workstation",
      "spatial-tablet",
      "intelligence-laptop",
      "dual-workstation",
      "city-command",
    ],
    tone: "#85b8b9",
    composition: "care",
  },
  metrica: {
    frames: ["creative-studio", "finance-workstation", "intelligence-laptop"],
    tone: "#9397be",
    composition: "data",
  },
  politiqsync: {
    frames: ["intelligence-laptop", "finance-workstation", "spatial-tablet"],
    tone: "#a79ac0",
    composition: "territory",
  },
  luxoflex: {
    frames: [
      "intelligence-laptop",
      "finance-workstation",
      "macbook-front",
      "spatial-tablet",
      "creative-studio",
      "city-command",
    ],
    tone: "#b8aa91",
    composition: "commerce",
  },
  promptlab: {
    frames: ["macbook-front", "intelligence-laptop", "creative-studio"],
    tone: "#88b2a0",
    composition: "creative",
  },
  reportscan: {
    frames: ["finance-workstation", "intelligence-laptop", "macbook-front"],
    tone: "#a8aeb8",
    composition: "documents",
  },
  "3d-converter": {
    frames: [
      "intelligence-laptop",
      "macbook-front",
      "finance-workstation",
      "spatial-tablet",
      "creative-studio",
    ],
    tone: "#baa0bd",
    composition: "sculpture",
  },
  "3d-projector": {
    frames: [
      "spatial-tablet",
      "intelligence-laptop",
      "macbook-front",
      "browser-window",
    ],
    tone: "#8bacc3",
    composition: "dimension",
  },
  axion: {
    frames: ["mobile-pair", "macbook-front", "spatial-tablet", "mobile-pair"],
    tone: "#b9a484",
    composition: "identity",
  },
};

export function getProjectScene(id: string, slot = 1) {
  const scene = scenes[id] ?? scenes.agentos;
  const defaults: DeviceFrameId[] = [
    "intelligence-laptop",
    "creative-studio",
    "macbook-front",
    "spatial-tablet",
    "finance-workstation",
    "fleet-workstation",
    "mobile-pair",
  ];
  // Explicit sequences may repeat a phone for distinct, genuine mobile views.
  const sequence = [
    ...scene.frames,
    ...defaults.filter((id) => !scene.frames.includes(id)),
  ].slice(0, 6);
  return { ...scene, frameId: sequence[(slot - 1) % sequence.length] };
}
