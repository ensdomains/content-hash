import { equalBytes } from "@noble/curves/abstract/utils";
import type { MultihashDigest } from "../types.js";
import { coerce } from "./coerce.js";
import { decodeVarint, encodeVarint, varintEncodingLength } from "./varint.js";

/**
 * Represents a multihash digest which carries information about the
 * hashing algorithm and an actual hash digest.
 */
export class Digest<Code extends number, Size extends number>
  implements MultihashDigest
{
  readonly code: Code;
  readonly size: Size;
  readonly digest: Uint8Array;
  readonly bytes: Uint8Array;

  /**
   * Creates a multihash digest.
   */
  constructor(code: Code, size: Size, digest: Uint8Array, bytes: Uint8Array) {
    this.code = code;
    this.size = size;
    this.digest = digest;
    this.bytes = bytes;
  }
}

/**
 * Creates a multihash digest.
 */
export const createDigest = <Code extends number>(
  code: Code,
  digest: Uint8Array
): Digest<Code, number> => {
  const size = digest.byteLength;
  const sizeOffset = varintEncodingLength(code);
  const digestOffset = sizeOffset + varintEncodingLength(size);

  const bytes = new Uint8Array(digestOffset + size);
  encodeVarint(code, bytes, 0);
  encodeVarint(size, bytes, sizeOffset);
  bytes.set(digest, digestOffset);

  return new Digest(code, size, digest, bytes);
};

/**
 * Turns bytes representation of multihash digest into an instance.
 */
export const decodeDigest = (multihash: Uint8Array): MultihashDigest => {
  const bytes = coerce(multihash);
  const [code, sizeOffset] = decodeVarint(bytes);
  const [size, digestOffset] = decodeVarint(bytes.subarray(sizeOffset));
  const digest = bytes.subarray(sizeOffset + digestOffset);

  if (digest.byteLength !== size) {
    throw new Error("Incorrect length");
  }

  return new Digest(code, size, digest, bytes);
};

export const digestEquals = (
  a: MultihashDigest,
  b: unknown
): b is MultihashDigest => {
  if (a === b) {
    return true;
  } else {
    const data = b as { code?: unknown; size?: unknown; bytes?: unknown };

    return (
      a.code === data.code &&
      a.size === data.size &&
      data.bytes instanceof Uint8Array &&
      equalBytes(a.bytes, data.bytes)
    );
  }
};
