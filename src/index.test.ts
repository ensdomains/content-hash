import { describe, expect, test } from "vitest";

import { decode, encode, getCodec } from "./index.js";

const ipfs_CIDv0 = "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4";
const ipfs_CIDv1 =
  "bafybeibj6lixxzqtsb45ysdjnupvqkufgdvzqbnvmhw2kf7cfkesy7r7d4";
const ipfs_contentHash =
  "e3010170122029f2d17be6139079dc48696d1f582a8530eb9805b561eda517e22a892c7e3f1f";
const ipns_CIDv1 = "k2k4r8kgnix5x0snul9112xdpqgiwc5xmvi8ja0szfhntep2d7qv8zz3";
const ipns_peerID_B58_contentHash =
  "e5010172122029f2d17be6139079dc48696d1f582a8530eb9805b561eda517e22a892c7e3f1f";
const ipns_peerID_B58 = "12D3KooWG4NvqQVczTrWY1H2tvsJmbQf5bbA3xGYXC4FM3wWCfE4";
const ipns_libp2pKey_CIDv1 =
  "k51qzi5uqu5dihst24f3rp2ej4co9berxohfkxaenbq1wjty7nrd5e9xp4afx1";
const ipns_ED25519_contentHash =
  "e50101720024080112205cbd1cc86ac20d6640795809c2a185bb2504538a2de8076da5a6971b8acb4715";
const swarm =
  "d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162";
const swarm_contentHash =
  "e40101fa011b20d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162";
const onion = "zqktlwi4fecvo6ri";
const onion_contentHash = "bc037a716b746c776934666563766f367269";
const onion3 = "p53lf57qovyuvwsc6xnrppyply3vtqm7l6pcobkmyqsiofyeznfu5uqd";
const onion3_contentHash =
  "bd037035336c663537716f7679757677736336786e72707079706c79337674716d376c3670636f626b6d797173696f6679657a6e667535757164";
const skylink = "CABAB_1Dt0FJsxqsu_J4TodNCbCGvtFf1Uys_3EgzOlTcg";
const skylink_contentHash =
  "90b2c60508004007fd43b74149b31aacbbf2784e874d09b086bed15fd54cacff7120cce95372";
const arweave = "ys32Pt8uC7TrVxHdOLByOspfPEq2LO63wREHQIM9SJQ";
const arweave_contentHash =
  "90b2ca05cacdf63edf2e0bb4eb5711dd38b0723aca5f3c4ab62ceeb7c1110740833d4894";
const adnl =
  "61bd855da6c07e8d1c807e880c2a9a6272011cfc2b34b2e9de32cd37ff6f4ae5";
const adnl_contentHash =
  "90b2da0561bd855da6c07e8d1c807e880c2a9a6272011cfc2b34b2e9de32cd37ff6f4ae5";
describe("content-hash (legacy tests)", () => {
  describe("decode", () => {
    test("ipfs", () => {
      expect(decode(ipfs_contentHash)).toEqual(ipfs_CIDv1);
    });
    test("swarm", () => {
      expect(decode(swarm_contentHash)).toEqual(swarm);
    });
    test("onion", () => {
      expect(decode(onion_contentHash)).toEqual(onion);
    });
  });
  describe("encode", () => {
    test("ipfs - CIDv0", () => {
      expect(encode("ipfs", ipfs_CIDv0)).toEqual(ipfs_contentHash);
    });
    test("ipfs - CIDv1", () => {
      expect(encode("ipfs", ipfs_CIDv1)).toEqual(ipfs_contentHash);
    });
    test("swarm", () => {
      expect(encode("swarm", swarm)).toEqual(swarm_contentHash);
    });
    test("onion", () => {
      expect(encode("onion", onion)).toEqual(onion_contentHash);
    });
  });
  describe("getCodec", () => {
    test("ipfs", () => {
      expect(getCodec(ipfs_contentHash)).toEqual("ipfs");
    });
    test("swarm", () => {
      expect(getCodec(swarm_contentHash)).toEqual("swarm");
    });
    test("onion", () => {
      expect(getCodec(onion_contentHash)).toEqual("onion");
    });
  });
});

describe("content-hash", () => {
  describe("decode", () => {
    test("swarm", () => {
      expect(decode(swarm_contentHash)).toEqual(swarm);
    });
    test("ipfs", () => {
      expect(decode(ipfs_contentHash)).toEqual(ipfs_CIDv1);
    });
    describe("ipns", () => {
      test("legacy PeerID => CIDv1", () => {
        expect(decode(ipns_peerID_B58_contentHash)).toEqual(ipns_CIDv1);
      });
      test("ED25519 => CIDv1 with libp2p-key codec", () => {
        expect(decode(ipns_ED25519_contentHash)).toEqual(ipns_libp2pKey_CIDv1);
      });
      test("DNSLINK", () => {
        // DNSLink is fine to be used before ENS resolve occurs, but should be avoided after
        // Context: https://github.com/ensdomains/ens-app/issues/849#issuecomment-777088950
        // For now, we allow decoding of legacy values:
        const deprecated_dnslink_contentHash =
          "e5010170000f6170702e756e69737761702e6f7267";
        const deprecated_dnslink_value = "app.uniswap.org";

        expect(decode(deprecated_dnslink_contentHash)).toEqual(
          deprecated_dnslink_value
        );
      });
    });
    test("onion", () => {
      expect(decode(onion_contentHash)).toEqual(onion);
    });
    test("onion3", () => {
      expect(decode(onion3_contentHash)).toEqual(onion3);
    });
    test("skynet", () => {
      expect(decode(skylink_contentHash)).toEqual(skylink);
    });
    test("arweave", () => {
      expect(decode(arweave_contentHash)).toEqual(arweave);
    });
    test("adnl", () => {
      expect(decode(adnl_contentHash)).toEqual(adnl);
    });
  });
  describe("encode", () => {
    test("swarm", () => {
      expect(encode("swarm", swarm)).toEqual(swarm_contentHash);
    });
    test("ipfs - CIDv0", () => {
      expect(encode("ipfs", ipfs_CIDv0)).toEqual(ipfs_contentHash);
    });
    test("ipfs - CIDv1", () => {
      expect(encode("ipfs", ipfs_CIDv1)).toEqual(ipfs_contentHash);
    });
    describe("ipns", () => {
      test("legacy PeerID (RSA B58)", () => {
        // RSA ones lookes like regular multihashes
        expect(encode("ipns", ipfs_CIDv0)).toEqual(ipns_peerID_B58_contentHash);
      });
      test("ED25519 (B58)", () => {
        // ED25519 are allowed to be encoded in Base58 for backward-interop
        expect(encode("ipns", ipns_peerID_B58)).toEqual(
          ipns_ED25519_contentHash
        );
      });
      test("PeerID (CIDv1)", () => {
        // libp2p-key as CID is the current canonical notation:
        // https://github.com/libp2p/specs/blob/master/RFC/0001-text-peerid-cid.md
        expect(encode("ipns", ipns_libp2pKey_CIDv1)).toEqual(
          ipns_ED25519_contentHash
        );
      });
      test("error on non-libp2p-key value", () => {
        expect(() => encode("ipns", "12uA8M8Ku8mHUumxHcu7uee")).throws(
          "ipns-ns allows only valid cryptographic libp2p-key identifiers, try using ED25519 pubkey instead"
        );
      });
    });
    test("onion", () => {
      expect(encode("onion", onion)).toEqual(onion_contentHash);
    });
    test("onion3", () => {
      expect(encode("onion3", onion3)).toEqual(onion3_contentHash);
    });
    test("skynet", () => {
      expect(encode("skynet", skylink)).toEqual(skylink_contentHash);
    });
    test("arweave", () => {
      expect(encode("arweave", arweave)).toEqual(arweave_contentHash);
    });
    test("adnl", () => {
      expect(encode("adnl", adnl)).toEqual(adnl_contentHash);
    });
    test("adnl - error on wrong length", () => {
      expect(() => encode("adnl", "deadbeef")).throws(
        "ADNL address must be 32 bytes, got 4"
      );
    });
  });
  describe("getCodec", () => {
    test("swarm", () => {
      expect(getCodec(swarm_contentHash)).toEqual("swarm");
    });
    test("ipfs", () => {
      expect(getCodec(ipfs_contentHash)).toEqual("ipfs");
    });
    test("ipns", () => {
      expect(getCodec(ipns_ED25519_contentHash)).toEqual("ipns");
    });
    test("onion", () => {
      expect(getCodec(onion_contentHash)).toEqual("onion");
    });
    test("onion3", () => {
      expect(getCodec(onion3_contentHash)).toEqual("onion3");
    });
    test("skynet", () => {
      expect(getCodec(skylink_contentHash)).toEqual("skynet");
    });
    test("arweave", () => {
      expect(getCodec(arweave_contentHash)).toEqual("arweave");
    });
    test("adnl", () => {
      expect(getCodec(adnl_contentHash)).toEqual("adnl");
    });
  });
});
