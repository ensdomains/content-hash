/**
 * A byte-encoded representation of some type of `Data`.
 *
 * A `ByteView` is essentially a `Uint8Array` that's been "tagged" with
 * a `Data` type parameter indicating the type of encoded data.
 *
 * For example, a `ByteView<{ hello: "world" }>` is a `Uint8Array` containing a
 * binary representation of a `{hello: "world"}`.
 */
export interface ByteView<Data> extends Uint8Array, Phantom<Data> {}

declare const Marker: unique symbol;

/**
 * A utility type to retain an unused type parameter `T`.
 * Similar to [phantom type parameters in Rust](https://doc.rust-lang.org/rust-by-example/generics/phantom.html).
 *
 * Capturing unused type parameters allows us to define "nominal types," which
 * TypeScript does not natively support. Nominal types in turn allow us to capture
 * semantics not represented in the actual type structure, without requiring us to define
 * new classes or pay additional runtime costs.
 *
 * For a concrete example, see {@link ByteView}, which extends the `Uint8Array` type to capture
 * type information about the structure of the data encoded into the array.
 */
export interface Phantom<T> {
  // This field can not be represented because field name is non-existent
  // unique symbol. But given that field is optional any object will valid
  // type constraint.
  [Marker]?: T;
}

export type MultihashDigest<Code extends number = number> = {
  /**
   * Code of the multihash
   */
  code: Code;

  /**
   * Raw digest (without a hashing algorithm info)
   */
  digest: Uint8Array;

  /**
   * byte length of the `this.digest`
   */
  size: number;

  /**
   * Binary representation of this multihash digest.
   */
  bytes: Uint8Array;
};
