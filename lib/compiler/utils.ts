/**
 * Composes a key by combining a parent key and a child key with a dot separator
 * for objects, or simple concatenation for arrays.
 *
 * @param {string | undefined} parent - The parent key (undefined if it is the root).
 * @param {string} key - The child key.
 * @param {boolean} fromArray - Whether the parent key refers to an array.
 * @returns {string} The composed key.
 */
export const composeKey = (parent: string | undefined, key: string, fromArray: boolean): string =>
    `${parent ?? ""}${parent && !fromArray ? "." : ""}${key}`;

