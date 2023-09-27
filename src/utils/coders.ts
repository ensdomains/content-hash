import {
  decodeArAddress,
  encodeArAddress,
} from "@ensdomains/address-encoder/coders";
import {
  base32Decode,
  base32Encode,
  base58DecodeNoCheck,
  base58EncodeNoCheck,
  createBase32Options,
} from "@ensdomains/address-encoder/utils";
import { utils } from "@scure/base";

export type Multibase<Prefix extends string> = string | `${Prefix}${string}`;

/**
 * Multibase encoder for the specific base encoding encodes bytes into
 * multibase of that encoding.
 */
export type MultibaseEncoder<Prefix extends string> = {
  /**
   * Name of the encoding.
   */
  name: string;
  /**
   * Prefix character for that base encoding.
   */
  prefix: Prefix;
  /**
   * Encodes binary data into **multibase** string (which will have a
   * prefix added).
   */
  encode: (bytes: Uint8Array) => Multibase<Prefix>;
};

/**
 * Interface implemented by multibase decoder, that takes multibase strings
 * to bytes. It may support single encoding like base32 or multiple encodings
 * like base32, base58btc, base64. If passed multibase is incompatible it will
 * throw an exception.
 */
export interface MultibaseDecoder<Prefix extends string> {
  /**
   * Decodes **multibase** string (which must have a multibase prefix added).
   * If prefix does not match
   */
  decode: (multibase: Multibase<Prefix>) => Uint8Array;
}
type MultibaseCoder<Prefix extends string> = MultibaseEncoder<Prefix> &
  MultibaseDecoder<Prefix>;
const createMultibaseCoder = <Prefix extends string>({
  name,
  prefix,
  encode: encodeWithoutPrefix,
  decode: decodeWithoutPrefix,
}: MultibaseCoder<Prefix>): MultibaseCoder<Prefix> => {
  const encode = (bytes: Uint8Array) =>
    `${prefix}${encodeWithoutPrefix(bytes)}`;
  const decode = (multibase: Multibase<Prefix>) => {
    if (!multibase.startsWith(prefix)) {
      throw new Error(`Multibase ${name} must start with ${prefix}`);
    }
    return decodeWithoutPrefix(multibase.slice(prefix.length));
  };
  return {
    name,
    prefix,
    encode,
    decode,
  };
};

export const base58btc = createMultibaseCoder({
  name: "base58btc",
  prefix: "z",
  encode: base58EncodeNoCheck,
  decode: base58DecodeNoCheck,
});

const base32Options = createBase32Options({
  alphabet: "abcdefghijklmnopqrstuvwxyz234567",
  padded: false,
});

export const base32 = createMultibaseCoder({
  name: "base32",
  prefix: "b",
  encode: (bytes: Uint8Array) => base32Encode(bytes, base32Options),
  decode: (multibase: Multibase<"b">) => base32Decode(multibase, base32Options),
});

const base36Chain = utils.chain(
  utils.radix(36),
  utils.alphabet("0123456789abcdefghijklmnopqrstuvwxyz"),
  utils.join("")
);

export const base36 = createMultibaseCoder({
  name: "base36",
  prefix: "k",
  encode: base36Chain.encode,
  decode: base36Chain.decode,
});

export const base64url = createMultibaseCoder({
  name: "base64url",
  prefix: "u",
  encode: encodeArAddress,
  decode: decodeArAddress,
});
