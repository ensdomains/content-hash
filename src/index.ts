import { concatUint8Arrays } from "./helpers.js";
import { codeToName, nameToCode, type Codec, type CodecId } from "./map.js";
import {
  bytesToHexString,
  hexStringToBytes,
  profiles,
  type Profile,
} from "./profiles.js";
import {
  decodeVarint,
  encodeVarint,
  varintEncodingLength,
} from "./utils/varint.js";

export { type Codec, type CodecId } from "./map.js";

export { cidForWeb, cidV0ToV1Base32 } from "./helpers.js";

/**
 * Decode a Content Hash.
 * @param contentHash an hex string containing a content hash
 * @return the decoded content
 */
export const decode = (contentHash: string): string => {
  const bytes = hexStringToBytes(contentHash);
  const [code, offset] = decodeVarint(bytes);
  const value = bytes.slice(offset);
  const name = codeToName[code as CodecId];
  let profile = profiles[name as keyof typeof profiles] as Profile | undefined;
  if (!profile) profile = profiles["default"];
  return profile.decode(value);
};

/**
 * General purpose encoding function
 * @param name Codec name
 * @param value Content to encode
 */
export const encode = (name: Codec, value: string): string => {
  let profile = profiles[name as keyof typeof profiles] as Profile | undefined;
  if (!profile) profile = profiles["default"];
  const bytes = profile.encode(value);
  const code = nameToCode[name] as number;
  const codeBytes = encodeVarint(
    code,
    new Uint8Array(varintEncodingLength(code))
  );
  return bytesToHexString(concatUint8Arrays(codeBytes, bytes));
};

/**
 * Extract the codec of a content hash
 * @param contentHash hex string containing a content hash
 * @return the extracted codec
 */
export const getCodec = (contentHash: string): Codec | undefined => {
  const bytes = hexStringToBytes(contentHash);
  const [code] = decodeVarint(bytes);
  return codeToName[code as CodecId];
};
