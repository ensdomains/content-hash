# content-hash

[![npm package](https://img.shields.io/npm/v/@ensdomains/content-hash.svg)](https://www.npmjs.com/package/@ensdomains/content-hash) ![licence](https://img.shields.io/npm/l/@ensdomains/content-hash.svg)

> This is a simple package made for encoding and decoding content hashes as specified in the [EIP 1577](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1577.md).
> This package will be useful for every [Ethereum](https://www.ethereum.org/) developer wanting to interact with [EIP 1577](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1577.md) compliant [ENS resolvers](http://docs.ens.domains/en/latest/introduction.html).

## 🔠 Supported Codec

- `swarm`
- `ipfs`
- `ipns`
- `onion`
- `onion3`
- `skynet`
- `arweave`
- `walrus`

## 📥 Install

```bash
npm install @ensdomains/content-hash
```

## 🛠 Usage

```javascript
import { decode } from "@ensdomains/content-hash";

const encoded =
  "e3010170122029f2d17be6139079dc48696d1f582a8530eb9805b561eda517e22a892c7e3f1f";

const content = decode(encoded);
// 'QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4'
```

## 📕 API

> All hex string **inputs** can be prefixed with `0x`, but it's **not mandatory**.

> ⚠️ All **outputs** are **NOT** prefixed with `0x`

### decode( contentHash ) -> string

This function takes a content hash as a hex **string** and returns the decoded content as a **string**.

```javascript
import { decode } from "@ensdomains/content-hash";

const encoded =
  "e3010170122029f2d17be6139079dc48696d1f582a8530eb9805b561eda517e22a892c7e3f1f";

const content = decode(encoded);
// 'QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4'
```

### encode( codec, value) -> string

This function takes a [supported codec](#-supported-codec) as a **string** and a value as a **string** and returns coresponding content hash as a hex **string**.

```javascript
import { encode } from "@ensdomains/content-hash";

const onion = "zqktlwi4fecvo6ri";

const encoded = encode("onion", onion);
// 'bc037a716b746c776934666563766f367269'
```

### getCodec( contentHash ) -> string

This function takes a content hash as a hex **string** and returns the codec as a hex **string**.

```javascript
import { getCodec } from "@ensdomains/content-hash";

const encoded =
  "e40101701b20d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162";

const codec = getCodec(encoded);
// 'swarm'
```

### Helpers

- #### cidV0ToV1Base32( ipfsHash ) -> string

  This function takes an ipfsHash and converts it to a CID v1 encoded in base32.

  ```javascript
  import { cidV0ToV1Base32 } from "@ensdomains/content-hash";

  const ipfs = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";

  const cidV1 = cidV0ToV1Base32(ipfs);
  // 'bafybeibj6lixxzqtsb45ysdjnupvqkufgdvzqbnvmhw2kf7cfkesy7r7d4'
  ```

- #### cidForWeb( ipfsHash ) -> string

  This function takes any ipfsHash and converts it to DNS-compatible CID.

  ```javascript
  import { cidForWeb } from "@ensdomains/content-hash";

  const ipfs = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";

  const cidV1 = cidForWeb(ipfs);
  // 'bafybeibj6lixxzqtsb45ysdjnupvqkufgdvzqbnvmhw2kf7cfkesy7r7d4'
  ```

## 📝 License

This project is licensed under the **MIT License**, you can find it [here](https://github.com/ensdomains/content-hash/blob/master/LICENSE).

> Note that the dependencies may have a different License

## 👥 Acknowledgements

This repo is forked from the original [content-hash](https://github.com/pldespaigne/content-hash) library, which was written by [pldespaigne](https://github.com/pldespaigne).
