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
 * @param {string} [parent] - The parent key of the JSON object (null if it is the root).
 * @returns {Token[]} An array of tokens representing the JSON object.
 * @throws {InferenceError} If the type of a key cannot be inferred.
 */
export const tokenize = (jsonObj: Object, parent?: string): Token[] => {
    const tokens: Token[] = [];

    for (const [key, value] of Object.entries(jsonObj)) {

        const _type = parseType(value);
        if (_type === null) {
            throw new InferenceError(`Could not infer type of ${key}`);
        }

        if (_type === "Object") {
            tokens.push({
                parent: parent,
                name: key,
                _type: _type,
                // Object references don't store values
                value: null
            });

            // Recursively tokenize the nested object
            tokens.push(...tokenize(value,
                // Append the key to the parent key
                `${parent !== undefined ? parent + "." : ""}${key}`));
        } else if (_type === "Array") {
            tokens.push({
                parent: parent,
                name: key,
                _type: _type,
                // Object references don't store values
                value: null
            });

            tokens.push(...tokenizeArray(value, `${parent !== undefined ? parent + "." : ""}${key}`))
        } else {
            tokens.push({
                parent: parent,
                name: key,
                _type: _type,
                value: value
            });
        }
    }

    return tokens;
};

const tokenizeArray = (jsonArray: any[], arrayIdentifier: string): Token[] => {
    const tokens: Token[] = [];

    for (const value of jsonArray) {
        const _type = parseType(value);
        if (_type === null) {
            throw new InferenceError(`Could not infer type of value present in ${arrayIdentifier}`);
        }

        if (_type === "Object") {
            tokens.push({
                parent: arrayIdentifier,
                name: undefined,
                _type: _type,
                // Object references don't store values
                value: null
            });

            // Recursively tokenize the nested object
            tokens.push(...tokenize(value,
                // Append the key to the parent key
                `${parent !== undefined ? parent + "." : ""}${arrayIdentifier}`));
        } else {
            tokens.push({
                parent: arrayIdentifier,
                name: undefined,
                _type: _type,
                value: value
            });
        }
    }

    return tokens;
}

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