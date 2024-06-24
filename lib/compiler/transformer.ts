import { JsonBodyTest, Transformer } from "../../types/compiler/transformer.js";
import { JsonField } from "../../types/compiler/analyzer.js";
import { composeKey } from "./utils.js";

/**
 * A middle ground between the JSON field and the output tests
 */
type JsonBodyTestInternal = JsonBodyTest & {
    parent?: string,
    key: string,
};

export const transform: Transformer = (fields, simplify?) => {
    simplify ??= false;

    let testItems: JsonBodyTestInternal[] = [];

    const parentTypes: { [key: string]: "Object" | "Array" } = {};

    for (const field of fields) {
        if (field.type === "Object" || field.type === "Array") {
            const compositeKey = composeKey(field.parent, field.key, field.type === "Array");
            parentTypes[compositeKey] = field.type;

            if (!fields.some(field => field.parent === compositeKey)) {
                testItems.push({
                    testType: "CheckForEmpty",
                    path: compositeKey,
                    parent: field.parent,
                    key: field.key
                });
            }
        }
        else {
            insertTest(testItems, field, parentTypes);
        }
    }

    if (simplify) {
        testItems = simplifyArrayItems(fields, testItems);
    }

    return testItems.map(removeInternals);
}

const removeInternals = (item: JsonBodyTestInternal): JsonBodyTest => {
    const { parent, key, ...rest } = item;
    return rest;
}

// TODO: Implement simplification for objects with the same schema nested in arrays
const simplifyArrayItems = (fields: JsonField[], items: JsonBodyTestInternal[]): JsonBodyTestInternal[] => {
    const arrays = fields
        .filter(field => field.type === "Array");

    for (const array of arrays) {
        const key = array.key;

        const arrayFields = fields.filter(field => field.parent === key && field.type !== "Array" && field.type !== "Object");

        items = items.filter(item => item.parent !== key);

        const arrayItems = arrayFields.map(field => ({
            value: field.value,
            valueType: field.type,
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

const insertTest = (items: JsonBodyTestInternal[], field: JsonField, parentTypes: { [key: string]: "Array" | "Object" }): void => {
    if (field.type === "null") {
        items.push({
            testType: "CheckForNull",
            path: composeKey(field.parent, field.key, parentTypes[field.parent ?? ""] === "Array"),
            parent: field.parent,
            key: field.key,
        });
    }
    else {
        items.push({
            testType: "CheckForValue",
            path: composeKey(field.parent,
                field.key,
                parentTypes[field.parent ?? ""] === "Array"),
            value: field.value,
            valueType: field.type,
            parent: field.parent,
            key: field.key,
        });
    }
}
