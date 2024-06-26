import { expect } from 'chai';
import { analyze } from '../lib/compiler/analyzer.js';
import { JsonField } from '../types/compiler/analyzer.js';

describe("Tests for the analyzer", () => {
    it("Should analyze string values", () => {
        const jsonObj = {
            "string": "Hello, world!"
        };

        const fields = analyze(jsonObj);

        expect(fields).to.deep.equal([
            {
                parent: undefined,
                key: "string",
                type: "String",
                value: "Hello, world!"
            }
        ]);
    });

    it("Should analyze integer values", () => {
        const jsonObj = {
            "int": 1234567890
        };

        const fields = analyze(jsonObj);

        expect(fields).to.deep.equal([
            {
                parent: undefined,
                key: "int",
                type: "Number",
                value: 1234567890
            }
        ]);
    });

    it("Should analyze decimal values", () => {
        const jsonObj = {
            "decimal": 1234567890.1234567890
        };

        const fields = analyze(jsonObj);

        expect(fields).to.deep.equal([
            {
                parent: undefined,
                key: "decimal",
                type: "Number",
                value: 1234567890.1234567890
            }
        ]);
    });

    it("Should analyze null values", () => {
        const jsonObj = {
            "nullValue": null
        };

        const fields = analyze(jsonObj);

        expect(fields).to.deep.equal([
            {
                parent: undefined,
                key: "nullValue",
                type: "null",
                value: null
            }
        ]);
    });

    it("Should analyze boolean values", () => {
        const jsonObj = {
            "trueValue": true,
            "falseValue": false
        };

        const fields = analyze(jsonObj);

        expect(fields).to.deep.equal([
            {
                parent: undefined,
                key: "trueValue",
                type: "Boolean",
                value: true
            },
            {
                parent: undefined,
                key: "falseValue",
                type: "Boolean",
                value: false
            }
        ]);
    });

    it("Should analyze nested objects", () => {
        const jsonObj = {
            "nestedObject": {
                "key1": "value1",
                "key2": 2
            }
        };

        const fields = analyze(jsonObj);

        expect(fields).to.deep.equal([
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
        ]);
    });

    it("Should analyze deeply nested objects", () => {
        const jsonObj = {
            "deeplyNested": {
                "level1": {
                    "level2": {
                        "key": "value"
                    }
                }
            }
        };

        const fields = analyze(jsonObj);

        expect(fields).to.deep.equal([
            {
                parent: undefined,
                key: "deeplyNested",
                type: "Object",
                value: null
            },
            {
                parent: "deeplyNested",
                key: "level1",
                type: "Object",
                value: null
            },
            {
                parent: "deeplyNested.level1",
                key: "level2",
                type: "Object",
                value: null
            },
            {
                parent: "deeplyNested.level1.level2",
                key: "key",
                type: "String",
                value: "value"
            }
        ]);
    });

    it("Should analyze objects with multiple key types", () => {
        const jsonObj = {
            "mixedTypes": {
                "string": "value",
                "number": 42,
                "boolean": true,
                "null": null,
                "object": {
                    "key": "value"
                }
            }
        };

        const fields = analyze(jsonObj);

        expect(fields).to.deep.equal([
            {
                parent: undefined,
                key: "mixedTypes",
                type: "Object",
                value: null
            },
            {
                parent: "mixedTypes",
                key: "string",
                type: "String",
                value: "value"
            },
            {
                parent: "mixedTypes",
                key: "number",
                type: "Number",
                value: 42
            },
            {
                parent: "mixedTypes",
                key: "boolean",
                type: "Boolean",
                value: true
            },
            {
                parent: "mixedTypes",
                key: "null",
                type: "null",
                value: null
            },
            {
                parent: "mixedTypes",
                key: "object",
                type: "Object",
                value: null
            },
            {
                parent: "mixedTypes.object",
                key: "key",
                type: "String",
                value: "value"
            }
        ]);
    });

    it("Should analyze arrays", () => {
        const jsonObj = {
            "array": [
                "value1",
                "value2",
                "value3"
            ]
        };

        const fields = analyze(jsonObj);

        expect(fields).to.deep.equal([
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
        ])
    });

    it("Should analyze arrays of objects", () => {
        const jsonObj = {
            "arrayOfObjects": [
                {
                    // Single value
                    "key1": "value1"
                },
                {
                    // Multiple values
                    "key2": "value2",
                    "key3": "value3"
                }
            ]
        } as const;

        const fields = analyze(jsonObj);

        expect(fields).to.deep.equal([
            {
                parent: undefined,
                key: "arrayOfObjects",
                type: "Array",
                value: null
            },
            {
                parent: "arrayOfObjects",
                key: "[0]",
                type: "Object",
                value: null
            },
            {
                parent: "arrayOfObjects[0]",
                key: "key1",
                type: "String",
                value: "value1"
            },
            {
                parent: "arrayOfObjects",
                key: "[1]",
                type: "Object",
                value: null
            },
            {
                parent: "arrayOfObjects[1]",
                key: "key2",
                type: "String",
                value: "value2"
            },
            {
                parent: "arrayOfObjects[1]",
                key: "key3",
                type: "String",
                value: "value3"
            }
        ]);
    });

    it("Should analyze deeply nested objects in an array", () => {
        const jsonObj = {
            "arrayWithNestedObjects": [
                {
                    "level1": {
                        "level2": {
                            "key": "value"
                        }
                    }
                }
            ]
        };

        const fields = analyze(jsonObj);

        expect(fields).to.deep.equal([
            {
                parent: undefined,
                key: "arrayWithNestedObjects",
                type: "Array",
                value: null
            },
            {
                parent: "arrayWithNestedObjects",
                key: "[0]",
                type: "Object",
                value: null
            },
            {
                parent: "arrayWithNestedObjects[0]",
                key: "level1",
                type: "Object",
                value: null
            },
            {
                parent: "arrayWithNestedObjects[0].level1",
                key: "level2",
                type: "Object",
                value: null
            },
            {
                parent: "arrayWithNestedObjects[0].level1.level2",
                key: "key",
                type: "String",
                value: "value"
            }
        ]);
    });

    it("Should analyze array with multiple values and types", () => {
        const jsonObj = {
            "arrayWithMultipleValues": [
                "string",
                42,
                true,
                null,
                {
                    "key": "value"
                }
            ]
        }

        const fields = analyze(jsonObj);

        expect(fields).to.deep.equals(
            [
                {
                    parent: undefined,
                    key: "arrayWithMultipleValues",
                    type: "Array",
                    value: null
                },
                {
                    parent: "arrayWithMultipleValues",
                    key: "[0]",
                    type: "String",
                    value: "string"
                },
                {
                    parent: "arrayWithMultipleValues",
                    key: "[1]",
                    type: "Number",
                    value: 42
                },
                {
                    parent: "arrayWithMultipleValues",
                    key: "[2]",
                    type: "Boolean",
                    value: true
                },
                {
                    parent: "arrayWithMultipleValues",
                    key: "[3]",
                    type: "null",
                    value: null
                },
                {
                    parent: "arrayWithMultipleValues",
                    key: "[4]",
                    type: "Object",
                    value: null
                },
                {
                    parent: "arrayWithMultipleValues[4]",
                    key: "key",
                    type: "String",
                    value: "value"
                }
            ]
        )
    });

    it("Should analyze array of arrays", () => {
        const jsonObj = {
            "arrayOfArrays": [
                [
                    "value1",
                    "value2",
                    "value3"
                ],
                [
                    "value4",
                    "value5",
                    "value6"
                ]
            ]
        };

        const fields = analyze(jsonObj);

        expect(fields).to.deep.equal([
            {
                parent: undefined,
                key: "arrayOfArrays",
                type: "Array",
                value: null
            },
            {
                parent: "arrayOfArrays",
                key: "[0]",
                type: "Array",
                value: null
            },
            {
                parent: "arrayOfArrays[0]",
                key: "[0]",
                type: "String",
                value: "value1"
            },
            {
                parent: "arrayOfArrays[0]",
                key: "[1]",
                type: "String",
                value: "value2"
            },
            {
                parent: "arrayOfArrays[0]",
                key: "[2]",
                type: "String",
                value: "value3"
            },
            {
                parent: "arrayOfArrays",
                key: "[1]",
                type: "Array",
                value: null
            },
            {
                parent: "arrayOfArrays[1]",
                key: "[0]",
                type: "String",
                value: "value4"
            },
            {
                parent: "arrayOfArrays[1]",
                key: "[1]",
                type: "String",
                value: "value5"
            },
            {
                parent: "arrayOfArrays[1]",
                key: "[2]",
                type: "String",
                value: "value6"
            }
        ]);
    });
    it("Should be able to analyze arrays as the root object", () => {
        const jsonObj = [1, 2, 3];

        const fields = analyze(jsonObj);

        expect(fields).to.deep.equal([
            {
                parent: undefined,
                key: "[0]",
                type: "Number",
                value: 1
            },
            {
                parent: undefined,
                key: "[1]",
                type: "Number",
                value: 2
            },
            {
                parent: undefined,
                key: "[2]",
                type: "Number",
                value: 3
            }
        ]);
    });

    it("Should analyze complex objects correctly", () => {

        const jsonObj = {
            "people": [
                {
                    "id": 1,
                    "name": "John",
                    "height": 1.85,
                    "friends": [
                        2,
                        3
                    ]
                },
                {
                    "id": 2,
                    "name": "Jane",
                    "height": 1.75,
                    "friends": [
                        1,
                        3
                    ]
                },
                {
                    "id": 3,
                    "name": "Bob",
                    "height": 1.95,
                    "friends": [
                        1,
                        2,
                    ]
                },
            ]
        }

        const expectedFields: JsonField[] = [
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
            //#endrigion "people[0].friends"
            //#endretion "people[0]"

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

        const fields = analyze(jsonObj);
        expect(fields).to.deep.equal(expectedFields);
    });
});