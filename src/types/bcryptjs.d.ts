
/**
 * Type definitions for bcryptjs
 */

declare module 'bcryptjs' {
  /**
   * Synchronously generates a hash for the given string.
   * @param s The string to hash
   * @param salt The salt to use, or the number of rounds to generate a salt
   * @returns The hashed string
   */
  export function hashSync(s: string, salt: string | number): string;

  /**
   * Synchronously tests a string against a hash.
   * @param s The string to compare
   * @param hash The hash to test against
   * @returns true if matching, false otherwise
   */
  export function compareSync(s: string, hash: string): boolean;

  /**
   * Asynchronously generates a hash for the given string.
   * @param s The string to hash
   * @param salt The salt to use, or the number of rounds to generate a salt
   * @param callback Callback receiving the error, if any, and the resulting hash
   */
  export function hash(
    s: string,
    salt: string | number,
    callback: (err: Error | null, hash: string) => void
  ): void;

  /**
   * Asynchronously compares the given data against the given hash.
   * @param s The string to compare
   * @param hash The hash to test against
   * @param callback Callback receiving the error, if any, and the result
   */
  export function compare(
    s: string,
    hash: string,
    callback: (err: Error | null, same: boolean) => void
  ): void;

  /**
   * Generates a salt synchronously.
   * @param rounds The number of rounds to use, defaults to 10 if omitted
   * @returns The generated salt
   */
  export function genSaltSync(rounds?: number): string;

  /**
   * Generates a salt asynchronously.
   * @param rounds The number of rounds to use, defaults to 10 if omitted
   * @param callback Callback receiving the error, if any, and the resulting salt
   */
  export function genSalt(
    rounds: number | undefined | null,
    callback: (err: Error | null, salt: string) => void
  ): void;
  export function genSalt(callback: (err: Error | null, salt: string) => void): void;
}
