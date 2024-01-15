import {
  decodeArAddress,
  encodeArAddress,
} from "@ensdomains/address-encoder/coders";
import { CID } from "./utils/cid.js";
import { base32, base36 } from "./utils/coders.js";
import { createDigest, decodeDigest } from "./utils/digest.js";

type Bytes = Uint8Array;

/**
 * Convert a hexadecimal string to Bytes, the string can start with or without '0x'
 * @param hex a hexadecimal value
 * @return the resulting Bytes
 */
export const hexStringToBytes = (hex: string): Bytes => {
  let value: string = hex;
  if (value.startsWith("0x")) {
    value = value.slice(2);
  }

  if (value.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }

  const bytes = new Uint8Array(value.length / 2);

  for (let i = 0; i < value.length; i += 2) {
    bytes[i / 2] = parseInt(value.slice(i, i + 2), 16);
  }

  return bytes;
};

export const bytesToHexString = (bytes: Bytes): string => {
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
};

/**
 * Validates IPNS identifier to safeguard against insecure names.
 * @param cid used in ipns-ns
 * @return true if cid is a valid cryptographic IPNS identifier
 */
const isCryptographicIPNS = (cid: CID): boolean => {
  try {
    const { multihash } = cid;
    // Additional check for identifiers shorter
    // than what inlined ED25519 pubkey would be
    // https://github.com/ensdomains/ens-app/issues/849#issuecomment-777088950
    if (multihash.size < 38) {
      const mh = decodeDigest(multihash.bytes);
      // ED25519 pubkeys are inlined using identity hash function
      // and we should not see anything shorter than that
      if (mh.code === 0x0 && mh.size < 36) {
        // One can read inlined string value via:
        // console.log('ipns-ns id:', String(multiH.decode(new CID(value).multihash).digest))
        return false;
      }
    }
    // ok, CID looks fine
    return true;
  } catch (_) {
    return false;
  }
};

const base64Decode = (value: string): Bytes => decodeArAddress(value);

/**
 * list of known encoding,
 * encoding should be a function that takes a `string` input,
 * and return a {@link Bytes} result
 */
const encodes = {
  skynet: (value: string): Bytes => {
    return base64Decode(value);
  },
  swarm: (value: string): Bytes => {
    const bytes = hexStringToBytes(value);
    const multihash = createDigest(0x1b, bytes);
    return CID.create(1, 0xfa, multihash).bytes;
  },
  ipfs: (value: string): Bytes => {
    return CID.parse(value).toV1().bytes;
  },
  ipns: (value: string): Bytes => {
    const cid = CID.parse(value);
    // Represent IPNS name as a CID with libp2p-key codec
    // https://github.com/libp2p/specs/blob/master/RFC/0001-text-peerid-cid.md
    return CID.create(1, 0x72, cid.multihash).bytes;
  },
  utf8: (value: string): Bytes => {
    const encoder = new TextEncoder();
    return encoder.encode(value);
  },
  arweave: (value: string): Bytes => {
    return base64Decode(value);
  },
};

/**
 * list of known decoding,
 * decoding should be a function that takes a `Uint8Array` input,
 * and return a `string` result
 */
const decodes = {
  hexMultiHash: (value: Bytes): string => {
    const cid = CID.decode(value);
    return bytesToHexString(decodeDigest(cid.multihash.bytes).digest);
  },
  ipfs: (value: Bytes): string => {
    const cid = CID.decode(value).toV1();
    return cid.toString(cid.code === 0x72 ? base36 : base32);
  },
  ipns: (value: Bytes): string => {
    const cid = CID.decode(value).toV1();
    if (!isCryptographicIPNS(cid)) {
      // Value is not a libp2p-key, return original string
      console.warn(
        "[ensdomains/content-hash] use of non-cryptographic identifiers in ipns-ns is deprecated and will be removed, migrate to ED25519 libp2p-key"
      );
      return String.fromCodePoint(...CID.decode(value).multihash.digest);
      // TODO: start throwing an error (after some deprecation period)
      // throw Error('ipns-ns allows only valid cryptographic libp2p-key identifiers, try using ED25519 pubkey instead')
    }
    return cid.toString(base36);
  },
  utf8: (value: Bytes): string => {
    const decoder = new TextDecoder();
    return decoder.decode(value);
  },
  base64: (value: Bytes): string => {
    return encodeArAddress(value);
  },
};

export type Profile = {
  encode: (value: string) => Bytes;
  decode: (value: Bytes) => string;
};

/**
 * list of known encoding/decoding for a given codec,
 * `encode` should be chosen among the `encodes` functions
 * `decode` should be chosen among the `decodes` functions
 */
export const profiles = {
  skynet: {
    encode: encodes.skynet,
    decode: decodes.base64,
  },
  swarm: {
    encode: encodes.swarm,
    decode: decodes.hexMultiHash,
  },
  ipfs: {
    encode: encodes.ipfs,
    decode: decodes.ipfs,
  },
  ipns: {
    encode: encodes.ipns,
    decode: decodes.ipns,
  },
  arweave: {
    encode: encodes.arweave,
    decode: decodes.base64,
  },
  default: {
    encode: encodes.utf8,
    decode: decodes.utf8,
  },
} as const;
