import { JsonField, FieldType, Analyzer } from "../../types/compiler/analyzer.js";
import { JsonType } from "../../types/jsonTypes.js";
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
 * Analyzes a JSON object into an array of JsonFields.
 *
 * @param {Object} jsonObj - The JSON object to analyze.
 * @param {string} [parent] - The parent key of the JSON object (undefined if it is the root).
 * @returns {JsonField[]} An array of JsonFields representing the JSON object.
 * @throws {InferenceError} If the type of a key cannot be inferred.
 */
export const analyze: Analyzer = (jsonObj, parent?) => {
    const fields: JsonField[] = [];

    for (const [key, value] of Object.entries(jsonObj)) {
        fields.push(...analyzeValue(value, parent, key, false));
    }

    return fields;
};

/**
 * Analyzes a value (object, array, or primitive) into an array of JsonFields.
 *
 * @param {any} value - The value to analyze.
 * @param {string} [parent] - The parent key of the value (undefined if it is the root).
 * @param {string} [key] - The key of the value (undefined if it is an array element).
 * @returns {JsonField[]} An array of JsonFields representing the value.
 * @throws {InferenceError} If the type of the value cannot be inferred.
 */
const analyzeValue = (value: JsonType, parent: string | undefined, key: string, fromArray: boolean): JsonField[] => {
    const fields: JsonField[] = [];

    const _type = parseType(value);
    if (_type === null) {
        throw new InferenceError(`Could not infer type of ${composeKey(parent, key, fromArray)}`);
    }

    if (_type === "Array") {
        fields.push(...analyzeArray(value as JsonType[], parent, key, fromArray));
    } else if (_type === "Object") {
        fields.push({
            parent: parent,
            key: key,
            type: "Object",
            value: null
        });
        const fieldKey = composeKey(parent, key, fromArray);
        fields.push(...analyze(value as { [key: string]: JsonType }, fieldKey));
    } else {
        fields.push({
            parent: parent,
            key: key,
            type: _type,
            value: value
        });
    }

    return fields;
}

/**
 * Analyzes an array into an array of JsonFields.
 *
 * @param {any[]} jsonArray - The array to analyze.
 * @param {string} [parent] - The parent key of the array (undefined if it is the root).
 * @param {string} [key] - The key of the array (undefined if it is an array element).
 * @returns {JsonField[]} An array of JsonFields representing the array.
 */
const analyzeArray = (jsonArray: JsonType[], parent: string | undefined, key: string, fromArray: boolean): JsonField[] => {
    const fields: JsonField[] = [];

    fields.push({
        parent: parent,
        key: key,
        type: "Array",
        value: null
    });

    const arrayIdentifier = composeKey(parent, key, fromArray);
    for (const [index, value] of Object.entries(jsonArray)) {
        fields.push(...analyzeValue(value, arrayIdentifier, `[${index}]`, true));
    }

    return fields;
}

/**
 * Parses the type of a given value from a JSON object.
 *
 * @param {Exclude<any, bigint | symbol | undefined>} value - The value to parse.
 * @returns {FieldType | null} The parsed token type or null if the type is not recognized.
 */
const parseType = (value: JsonType):
    FieldType | null => {
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