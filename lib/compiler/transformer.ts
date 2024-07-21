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


/**
 * Represents a store of object types, where the key is a string identifier
 * and the value is either "Object" or "Array".
 */
type ObjectTypeStore = Record<string, "Object" | "Array">;

/**
 * Transforms a list of JsonFields into a list of JsonBodyTests.
 * 
 * @param {JsonField[]} fields - An array of JsonFields representing the schema.
 * @param {TransformerOptions} options - Options to apply additional transformations on the test generation.
 * @returns {JsonBodyTest[]} An array of JsonBodyTests representing the tests to be performed on the JSON body.
 */
export const transform: Transformer = (fields, options?) => {
    options ??= {
        simplifyArrays: false,
        checkEmptyObjects: false,
    };

    let testItems: JsonBodyTestInternal[] = [];


    // This will be used to lookup the parent types when composing keys.
    const parentTypes: ObjectTypeStore = {};

    for (const field of fields) {
        if (field.type === "Object" || field.type === "Array") {
            const compositeKey = composeKey(
                field.parent,
                field.key,
                parentTypes[field.parent ?? ""] === "Array");
            parentTypes[compositeKey] = field.type;

            if (options.checkEmptyObjects && !fields.some(field => field.parent === compositeKey)) {
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

    if (options.simplifyArrays) {
        testItems = simplifyArrayItems(fields, testItems, parentTypes);
    }

    return testItems.map(removeInternals);
}

const removeInternals = (item: JsonBodyTestInternal): JsonBodyTest => {
    // Remove parent and key from the object, as they are redundant with
    // the path property after the transformation.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { parent, key, ...rest } = item;
    return rest;
}


const simplifyArrayItems = (fields: JsonField[], items: JsonBodyTestInternal[], parentTypes: ObjectTypeStore): JsonBodyTestInternal[] => {
    const arrays = fields
        .filter(field => field.type === "Array");

    for (const array of arrays) {

        const key = array.key;
        const path = composeKey(array.parent, key, parentTypes[array.parent ?? ""] === "Array");

        const arrayFields = fields.filter(field => field.parent === path && field.type !== "Array" && field.type !== "Object");

        // Remove individual tests for the array items
        items = items.filter(item => item.parent !== path);

        const arrayItems = arrayFields.map(field => ({
            value: field.value,
            valueType: field.type,
        }))

        // Only generate tests if the array contains inner values
        if (arrayItems.length > 0) {
            items.push({
                testType: "CheckArrayItems",
                path: path,
                items: arrayItems,
                parent: array.parent,
                key: key,
            })
        };
    }

    return items;
}

const insertTest = (items: JsonBodyTestInternal[], field: JsonField, parentTypes: ObjectTypeStore): void => {
    const fromArray = parentTypes[field.parent ?? ""] === "Array"

    if (field.type === "null") {
        items.push({
            testType: "CheckForNull",
            path: composeKey(field.parent, field.key, fromArray),
            parent: field.parent,
            key: field.key,
        });
    }
    else {
        items.push({
            testType: "CheckForValue",
            path: composeKey(field.parent, field.key, fromArray),
            value: field.value,
            valueType: field.type,
            parent: field.parent,
            key: field.key,
        });
    }
}
