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


/**
 * Type assertion functions
 */

export function isString(value: unknown): asserts value is string {
    if (typeof value !== "string") {
        throw new TypeError(`Expected a string, got ${typeof value}`);
    }
};

export function isNumber(value: unknown): asserts value is number {
    if (typeof value !== "number") {
        throw new TypeError(`Expected a number, got ${typeof value}`);
    }
};

export function isBoolean(value: unknown): asserts value is boolean {
    if (typeof value !== "boolean") {
        throw new TypeError(`Expected a boolean, got ${typeof value}`);
    }
};

export function isNull(value: unknown): asserts value is null {
    if (value !== null) {
        throw new TypeError(`Expected null, got ${typeof value}`);
    }
}