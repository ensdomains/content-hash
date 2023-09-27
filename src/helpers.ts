import { CID } from "./utils/cid.js";
import { base32, base36 } from "./utils/coders.js";

// Label's max length in DNS (https://tools.ietf.org/html/rfc1034#page-7)
const dnsLabelMaxLength = 63;

/**
 * Take any ipfsHash and convert it to DNS-compatible CID
 * @param ipfsHash a regular ipfs hash either a cid v0 or v1
 * @return the resulting ipfs hash as a cid v1
 */
export const cidForWeb = (ipfsHash: string): string => {
  let cid = CID.parse(ipfsHash);
  if (cid.version === 0) {
    cid = cid.toV1();
  }
  const dnsLabel = cid.toString(base32);
  if (dnsLabel.length > dnsLabelMaxLength) {
    const b36 = cid.toString(base36);
    if (b36.length <= dnsLabelMaxLength) {
      return b36;
    }
    throw new TypeError(
      `CID is longer than DNS limit of ${dnsLabelMaxLength} characters and is not compatible with public gateways`
    );
  }
  return dnsLabel;
};

/**
 * Take any ipfsHash and convert it to a CID v1 encoded in base32.
 * @param ipfsHash a regular ipfs hash either a cid v0 or v1 (v1 will remain unchanged)
 * @return the resulting ipfs hash as a cid v1
 */
export const cidV0ToV1Base32 = (ipfsHash: string): string => {
  let cid = CID.parse(ipfsHash);
  if (cid.version === 0) {
    cid = cid.toV1();
  }
  return cid.toString(base32);
};

/**
 * Concats two Uint8Arrays
 * @param array1 first array
 * @param array2 second array
 * @return the resulting array
 */
export const concatUint8Arrays = (
  array1: Uint8Array,
  array2: Uint8Array
): Uint8Array => {
  let result = new Uint8Array(array1.length + array2.length);
  result.set(array1, 0);
  result.set(array2, array1.length);
  return result;
};
