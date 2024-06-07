import { Token, TokenType } from "./types";

/**
 * Represents an error that occurred during type inference.
 */
export class InferenceError extends Error {
    /**
     * Creates a new InferenceError instance.
     * @param {string} message - The error message.
     */
    constructor(message: string) {
        super(message);
        this.name = "InferenceError";
    }
}

/**
 * Tokenizes a JSON object into an array of tokens.
 *
 * @param {Object} jsonObj - The JSON object to tokenize.
 * @param {string} [parent] - The parent key of the JSON object (undefined if it is the root).
 * @returns {Token[]} An array of tokens representing the JSON object.
 * @throws {InferenceError} If the type of a key cannot be inferred.
 */
export const tokenize = (jsonObj: Object, parent?: string): Token[] => {
    const tokens: Token[] = [];

    for (const [key, value] of Object.entries(jsonObj)) {
        tokens.push(...tokenizeValue(value, parent, key));
    }

    return tokens;
};

/**
 * Tokenizes a value (object, array, or primitive) into an array of tokens.
 *
 * @param {any} value - The value to tokenize.
 * @param {string} [parent] - The parent key of the value (null if it is the root).
 * @param {string} [key] - The key of the value (null if it is an array element).
 * @returns {Token[]} An array of tokens representing the value.
 * @throws {InferenceError} If the type of the value cannot be inferred.
 */
const tokenizeValue = (value: any, parent?: string, key?: string): Token[] => {
    const tokens: Token[] = [];

    const _type = parseType(value);
    if (_type === null) {
        throw new InferenceError(`Could not infer type of ${composeKey(parent, key ?? "")}`);
    }

    if (_type === "Array") {
        tokens.push(...tokenizeArray(value, parent, key));
    } else if (_type === "Object") {
        tokens.push({
            parent: parent,
            name: key,
            _type: "Object",
            value: null
        });
        tokens.push(...tokenize(value, composeKey(parent, key ?? "")));
    } else {
        tokens.push({
            parent: parent,
            name: key,
            _type: _type,
            value: value
        });
    }

    return tokens;
}

/**
 * Tokenizes an array into an array of tokens.
 *
 * @param {any[]} jsonArray - The array to tokenize.
 * @param {string} [parent] - The parent key of the array (undefined if it is the root).
 * @param {string} [key] - The key of the array (undefined if it is an array element).
 * @returns {Token[]} An array of tokens representing the array.
 */
// FIXME: Does not handle nested arrays properly
const tokenizeArray = (jsonArray: any[], parent?: string, key?: string): Token[] => {
    const tokens: Token[] = [];

    tokens.push({
        parent: parent,
        name: key,
        _type: "Array",
        value: null
    });

    const arrayIdentifier = composeKey(parent, key);
    for (const value of jsonArray) {
        tokens.push(...tokenizeValue(value, arrayIdentifier));
    }

    return tokens;
}

/**
 * Composes a key by combining a parent key and a child key with a dot separator.
 *
 * @param {string | undefined} parent - The parent key (undefined if it is the root).
 * @param {string} key - The child key.
 * @returns {string} The composed key.
 */
const composeKey = (parent: string | undefined, key?: string): string =>
    `${parent ?? ""}${parent && key ? "." : ""}${key ?? ""}`;


/**
 * Parses the type of a given value from a JSON object.
 *
 * @param {Exclude<any, bigint | symbol | undefined>} value - The value to parse.
 * @returns {TokenType | null} The parsed token type or null if the type is not recognized.
 */
const parseType = (value: Exclude<any, bigint | symbol | undefined>):
    TokenType | null => {
    switch (typeof value) {
        case "string":
            return "String";
        case "number":
            if (Number.isInteger(value)) {
                return "Integer";
            }
            else {
                return "Decimal";
            }
        case "boolean":
            return "Boolean";
        case "object":
            if (Array.isArray(value)) {
                return "Array";
            } else if (value === null) {
                return "null";
            } else {
                return "Object";
            }
        default:
            return null;
    }
};