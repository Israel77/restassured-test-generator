import { Token, TokenType, Tokenizer } from "../types/compiler/tokenizer";
import { JsonType } from "../types/jsonTypes";
import { composeKey } from "./utils.js";

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
export const tokenize: Tokenizer = (jsonObj, parent?) => {
    const tokens: Token[] = [];

    for (const [key, value] of Object.entries(jsonObj)) {
        tokens.push(...tokenizeValue(value, parent, key, false));
    }

    return tokens;
};

/**
 * Tokenizes a value (object, array, or primitive) into an array of tokens.
 *
 * @param {any} value - The value to tokenize.
 * @param {string} [parent] - The parent key of the value (undefined if it is the root).
 * @param {string} [key] - The key of the value (undefined if it is an array element).
 * @returns {Token[]} An array of tokens representing the value.
 * @throws {InferenceError} If the type of the value cannot be inferred.
 */
const tokenizeValue = (value: JsonType, parent: string | undefined, key: string, fromArray: boolean): Token[] => {
    const tokens: Token[] = [];

    const _type = parseType(value);
    if (_type === null) {
        throw new InferenceError(`Could not infer type of ${composeKey(parent, key, fromArray)}`);
    }

    if (_type === "Array") {
        tokens.push(...tokenizeArray(value as JsonType[], parent, key, fromArray));
    } else if (_type === "Object") {
        tokens.push({
            parent: parent,
            key: key,
            type: "Object",
            value: null
        });
        const tokenKey = composeKey(parent, key, fromArray);
        tokens.push(...tokenize(value as { [key: string]: JsonType }, tokenKey));
    } else {
        tokens.push({
            parent: parent,
            key: key,
            type: _type,
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
const tokenizeArray = (jsonArray: JsonType[], parent: string | undefined, key: string, fromArray: boolean): Token[] => {
    const tokens: Token[] = [];

    tokens.push({
        parent: parent,
        key: key,
        type: "Array",
        value: null
    });

    const arrayIdentifier = composeKey(parent, key, fromArray);
    for (const [index, value] of Object.entries(jsonArray)) {
        tokens.push(...tokenizeValue(value, arrayIdentifier, `[${index}]`, true));
    }

    return tokens;
}

/**
 * Parses the type of a given value from a JSON object.
 *
 * @param {Exclude<any, bigint | symbol | undefined>} value - The value to parse.
 * @returns {TokenType | null} The parsed token type or null if the type is not recognized.
 */
const parseType = (value: JsonType):
    TokenType | null => {
    switch (typeof value) {
        case "string":
            return "String";
        case "number":
            return "Number"
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