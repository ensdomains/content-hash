export const codeToName = {
  0xe3: "ipfs",
  0xe5: "ipns",
  0xe4: "swarm",
  0x01bc: "onion",
  0x01bd: "onion3",
  0xb19910: "skynet",
  0xb29910: "arweave",
  0xb59910: "walrus",
} as const;

export const nameToCode = {
  ipfs: 0xe3,
  ipns: 0xe5,
  swarm: 0xe4,
  onion: 0x01bc,
  onion3: 0x01bd,
  skynet: 0xb19910,
  arweave: 0xb29910,
  walrus: 0xb59910,
} as const;

export type CodecId = keyof typeof codeToName;
export type Codec = keyof typeof nameToCode;
