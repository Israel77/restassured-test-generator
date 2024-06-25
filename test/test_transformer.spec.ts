import { expect } from "chai";
import { transform } from "../lib/compiler/transformer.js";
import { JsonField } from "../types/compiler/analyzer.js";
import { JsonBodyTest } from "../types/compiler/transformer.js";

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

    it("Should evaluate complex objects", () => {
        const fields: JsonField[] = [
            //#region "people"
            {
                parent: undefined,
                key: "people",
                type: "Array",
                value: null
            },
            //#region "people[0]"
            {
                parent: "people",
                key: "[0]",
                type: "Object",
                value: null
            },
            {
                parent: "people[0]",
                key: "id",
                type: "Number",
                value: 1
            },
            {
                parent: "people[0]",
                key: "name",
                type: "String",
                value: "John"
            },
            {
                parent: "people[0]",
                key: "height",
                type: "Number",
                value: 1.85
            },
            //#region "people[0].friends"
            {
                parent: "people[0]",
                key: "friends",
                type: "Array",
                value: null
            },
            {
                parent: "people[0].friends",
                key: "[0]",
                type: "Number",
                value: 2
            },
            {
                parent: "people[0].friends",
                key: "[1]",
                type: "Number",
                value: 3
            },
            //#endregion "people[0].friends"
            //#endregion "people[0]"

            //#region "people[1]"
            {
                parent: "people",
                key: "[1]",
                type: "Object",
                value: null
            },
            {
                parent: "people[1]",
                key: "id",
                type: "Number",
                value: 2
            },
            {
                parent: "people[1]",
                key: "name",
                type: "String",
                value: "Jane"
            },
            {
                parent: "people[1]",
                key: "height",
                type: "Number",
                value: 1.75
            },
            //#region "people[1].friends"
            {
                parent: "people[1]",
                key: "friends",
                type: "Array",
                value: null
            },
            {
                parent: "people[1].friends",
                key: "[0]",
                type: "Number",
                value: 1
            },
            {
                parent: "people[1].friends",
                key: "[1]",
                type: "Number",
                value: 3
            },
            //#endregion "people[1].friends"
            //#endregion "people[1]"

            //#region "people[2]"
            {
                parent: "people",
                key: "[2]",
                type: "Object",
                value: null
            },
            {
                parent: "people[2]",
                key: "id",
                type: "Number",
                value: 3
            },
            {
                parent: "people[2]",
                key: "name",
                type: "String",
                value: "Bob"
            },
            {
                parent: "people[2]",
                key: "height",
                type: "Number",
                value: 1.95
            },
            //#region "people[1].friends"
            {
                parent: "people[2]",
                key: "friends",
                type: "Array",
                value: null
            },
            {
                parent: "people[2].friends",
                key: "[0]",
                type: "Number",
                value: 1
            },
            {
                parent: "people[2].friends",
                key: "[1]",
                type: "Number",
                value: 2
            },
            //#endregion "people[1].friends"
            //#endregion "people[1]"

            //#endregion "people"
        ]

        const expectedResult: JsonBodyTest[] = [
            //#region "people[0]"
            {
                testType: "CheckForValue",
                path: "people[0].id",
                valueType: "Number",
                value: 1
            },
            {
                testType: "CheckForValue",
                path: "people[0].name",
                valueType: "String",
                value: "John"
            },
            {
                testType: "CheckForValue",
                path: "people[0].height",
                valueType: "Number",
                value: 1.85
            },
            //#region "people[0].friends"
            {
                testType: "CheckForValue",
                path: "people[0].friends[0]",
                valueType: "Number",
                value: 2
            },
            {
                testType: "CheckForValue",
                path: "people[0].friends[1]",
                valueType: "Number",
                value: 3
            },
            //#endregion "people[0].friends"
            //#endregion "people[0]"

            //#region "people[1]"
            {
                testType: "CheckForValue",
                path: "people[1].id",
                valueType: "Number",
                value: 2
            },
            {
                testType: "CheckForValue",
                path: "people[1].name",
                valueType: "String",
                value: "Jane"
            },
            {
                testType: "CheckForValue",
                path: "people[1].height",
                valueType: "Number",
                value: 1.75
            },
            //#region "people[1].friends"
            {
                testType: "CheckForValue",
                path: "people[1].friends[0]",
                valueType: "Number",
                value: 1
            },
            {
                testType: "CheckForValue",
                path: "people[1].friends[1]",
                valueType: "Number",
                value: 3
            },
            //#endregion "people[1].friends"
            //#endregion "people[1]"

            //#region "people[2]"
            {
                testType: "CheckForValue",
                path: "people[2].id",
                valueType: "Number",
                value: 3
            },
            {
                testType: "CheckForValue",
                path: "people[2].name",
                valueType: "String",
                value: "Bob"
            },
            {
                testType: "CheckForValue",
                path: "people[2].height",
                valueType: "Number",
                value: 1.95
            },
            //#region "people[1].friends"
            {
                testType: "CheckForValue",
                path: "people[2].friends[0]",
                valueType: "Number",
                value: 1
            },
            {
                testType: "CheckForValue",
                path: "people[2].friends[1]",
                valueType: "Number",
                value: 2
            },
            //#region "people[2].friends"
            //#endregion "people[2].friends"
            //#endregion "people[2]"
        ]

        const result = transform(fields, false);

        expect(result).to.deep.equals(expectedResult);
    });
});
