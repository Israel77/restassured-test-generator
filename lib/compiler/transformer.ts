import { JsonBodyTest, Transformer } from "../../types/compiler/transformer.js";
import { JsonField } from "../../types/compiler/analyzer.js";
import { composeKey } from "./utils.js";

/**
 * A middle ground between the token and the output tests
 */
type JsonBodyTestInternal = JsonBodyTest & {
    parent?: string,
    key: string,
};

export const transform: Transformer = (tokens, simplify?) => {
    simplify ??= false;

    let testItems: JsonBodyTestInternal[] = [];

    const parentTypes: { [key: string]: "Object" | "Array" } = {};

    for (const token of tokens) {
        if (token.type === "Object" || token.type === "Array") {
            parentTypes[composeKey(token.parent, token.key, token.type === "Array")] = token.type;
        }
        else {
            insertTest(testItems, token, parentTypes);
        }
    }

    if (simplify) {
        testItems = simplifyArrayItems(tokens, testItems);
    }

    return testItems.map(removeInternals);
}

const removeInternals = (item: JsonBodyTestInternal): JsonBodyTest => {
    const { parent, key, ...rest } = item;
    return rest;
}

// TODO: Implement simplification for objects with the same schema nested in arrays
const simplifyArrayItems = (tokens: JsonField[], items: JsonBodyTestInternal[]): JsonBodyTestInternal[] => {
    const arrays = tokens
        .filter(token => token.type === "Array");

    for (const array of arrays) {
        const key = array.key;

        const arrayTokens = tokens.filter(token => token.parent === key && token.type !== "Array" && token.type !== "Object");

        items = items.filter(item => item.parent !== key);

        const arrayItems = arrayTokens.map(token => ({
            value: token.value,
            valueType: token.type,
        }))

        // Only generate tests if the array contains inner values
        if (arrayItems.length > 0) {
            items.push({
                testType: "CheckArrayItems",
                path: composeKey(array.parent, key, true),
                items: arrayItems,
                parent: array.parent,
                key: key,
            })
        };
    }

    return items;
}

const insertTest = (items: JsonBodyTestInternal[], token: JsonField, parentTypes: { [key: string]: "Array" | "Object" }): void => {
    if (token.type === "null") {
        items.push({
            testType: "CheckForNull",
            path: composeKey(token.parent, token.key, parentTypes[token.parent ?? ""] === "Array"),
            parent: token.parent,
            key: token.key,
        });
    }
    else {
        items.push({
            testType: "CheckForValue",
            path: composeKey(token.parent,
                token.key,
                parentTypes[token.parent ?? ""] === "Array"),
            value: token.value,
            valueType: token.type,
            parent: token.parent,
            key: token.key,
        });
    }
}
