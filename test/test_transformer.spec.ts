import { expect } from "chai";
import { transform } from "../lib/compiler/transformer.js";
import { JsonField } from "../types/compiler/analyzer.js";

describe("Tests for the transformer", () => {
    it("Should evaluate string values", () => {
        const fields: JsonField[] = [
            {
                parent: undefined,
                key: "string",
                type: "String",
                value: "Hello, world!"
            }
        ];

        const items = transform(fields);

        expect(items).to.deep.equal([
            {
                testType: "CheckForValue",
                path: "string",
                value: "Hello, world!",
                valueType: "String"
            }
        ]);
    });

    it("Should evaluate integer values", () => {
        const fields: JsonField[] = [
            {
                parent: undefined,
                key: "int",
                type: "Number",
                value: 1234567890
            }
        ];

        const items = transform(fields);

        expect(items).to.deep.equal([
            {
                testType: "CheckForValue",
                path: "int",
                value: 1234567890,
                valueType: "Number"
            }
        ]);
    });

    it("Should evaluate null values", () => {
        const fields: JsonField[] = [
            {
                parent: undefined,
                key: "nullValue",
                type: "null",
                value: null
            }
        ];

        const items = transform(fields);

        expect(items).to.deep.equal([
            {
                testType: "CheckForNull",
                path: "nullValue"
            }
        ]);
    });

    it("Should evaluate nested objects", () => {
        const fields: JsonField[] = [
            {
                parent: undefined,
                key: "nestedObject",
                type: "Object",
                value: null
            },
            {
                parent: "nestedObject",
                key: "key1",
                type: "String",
                value: "value1"
            },
            {
                parent: "nestedObject",
                key: "key2",
                type: "Number",
                value: 2
            }
        ];

        const items = transform(fields);

        expect(items).to.deep.equal([
            {
                testType: "CheckForValue",
                path: "nestedObject.key1",
                value: "value1",
                valueType: "String"
            },
            {
                testType: "CheckForValue",
                path: "nestedObject.key2",
                value: 2,
                valueType: "Number"
            }
        ]);
    });

    it("Should evaluate arrays", () => {
        const fields: JsonField[] = [
            {
                parent: undefined,
                key: "array",
                type: "Array",
                value: null
            },
            {
                parent: "array",
                key: "[0]",
                type: "String",
                value: "value1"
            },
            {
                parent: "array",
                key: "[1]",
                type: "String",
                value: "value2"
            },
            {
                parent: "array",
                key: "[2]",
                type: "String",
                value: "value3"
            }
        ];

        const items = transform(fields);

        expect(items).to.deep.equal([
            {
                testType: "CheckForValue",
                path: "array[0]",
                value: "value1",
                valueType: "String"
            },
            {
                testType: "CheckForValue",
                path: "array[1]",
                value: "value2",
                valueType: "String"
            },
            {
                testType: "CheckForValue",
                path: "array[2]",
                value: "value3",
                valueType: "String"
            }
        ]);
    });

    it("Should merge array items when simplify is true", () => {
        const fields: JsonField[] = [
            {
                parent: undefined,
                key: "array",
                type: "Array",
                value: null
            },
            {
                parent: "array",
                key: "[0]",
                type: "String",
                value: "value1"
            },
            {
                parent: "array",
                key: "[1]",
                type: "String",
                value: "value2"
            },
            {
                parent: "array",
                key: "[2]",
                type: "String",
                value: "value3"
            }
        ];

        const items = transform(fields, true);

        expect(items.length).to.equal(1);
        expect(items[0]).to.deep.equal(
            {
                testType: "CheckArrayItems",
                path: "array",
                items: [
                    {
                        value: "value1",
                        valueType: "String"
                    },
                    {
                        value: "value2",
                        valueType: "String"
                    },
                    {
                        value: "value3",
                        valueType: "String"
                    }
                ]
            },
        );

    });

    it("Should evaluate empty nested objects or arrays", () => {
        const fields: JsonField[] = [
            {
                parent: undefined,
                key: "emptyObject",
                type: "Object",
                value: null
            },
            {
                parent: undefined,
                key: "emptyArray",
                type: "Array",
                value: null
            }
        ]

        const items = transform(fields);

        expect(items).to.deep.equal([
            {
                testType: "CheckForEmpty",
                path: "emptyObject"
            },
            {
                testType: "CheckForEmpty",
                path: "emptyArray"
            }
        ])
    })
});
