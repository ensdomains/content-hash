var MSB = 0x80,
  REST = 0x7f,
  MSBALL = ~REST,
  INT = Math.pow(2, 31);

export const encodeVarint = (
  num: number,
  out: Uint8Array,
  offset: number = 0
): Uint8Array => {
  out = out || [];
  offset = offset || 0;

  while (num >= INT) {
    out[offset++] = (num & 0xff) | MSB;
    num /= 128;
  }
  while (num & MSBALL) {
    out[offset++] = (num & 0xff) | MSB;
    num >>>= 7;
  }
  out[offset] = num | 0;

  return out;
};

var MSB$1 = 0x80,
  REST$1 = 0x7f;

export const decodeVarint = (
  buf: Uint8Array,
  offset: number = 0
): [number, number] => {
  var res = 0,
    offset = offset || 0,
    shift = 0,
    counter = offset,
    b,
    l = buf.length;

  do {
    if (counter >= l) {
      // @ts-ignore
      read.bytes = 0;
      throw new RangeError("Could not decode varint");
    }
    b = buf[counter++];
    res +=
      shift < 28 ? (b & REST$1) << shift : (b & REST$1) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB$1);

  return [res, counter - offset];
};

var N1 = Math.pow(2, 7);
var N2 = Math.pow(2, 14);
var N3 = Math.pow(2, 21);
var N4 = Math.pow(2, 28);
var N5 = Math.pow(2, 35);
var N6 = Math.pow(2, 42);
var N7 = Math.pow(2, 49);
var N8 = Math.pow(2, 56);
var N9 = Math.pow(2, 63);

export const varintEncodingLength = (value: number): number => {
  return value < N1
    ? 1
    : value < N2
    ? 2
    : value < N3
    ? 3
    : value < N4
    ? 4
    : value < N5
    ? 5
    : value < N6
    ? 6
    : value < N7
    ? 7
    : value < N8
    ? 8
    : value < N9
    ? 9
    : 10;
};
