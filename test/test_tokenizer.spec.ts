import { expect } from 'chai';
import { tokenize } from '../src/tokenizer.js';

describe("Tests for the tokenizer", () => {
    it("Should tokenize string values", () => {
        const jsonObj = {
            "string": "Hello, world!"
        };

        const tokens = tokenize(jsonObj);

        expect(tokens).to.deep.equal([
            {
                parent: undefined,
                name: "string",
                _type: "String",
                value: "Hello, world!"
            }
        ]);
    });

    it("Should tokenize integer values", () => {
        const jsonObj = {
            "int": 1234567890
        };

        const tokens = tokenize(jsonObj);

        expect(tokens).to.deep.equal([
            {
                parent: undefined,
                name: "int",
                _type: "Integer",
                value: 1234567890
            }
        ]);
    });

    it("Should tokenize decimal values", () => {
        const jsonObj = {
            "decimal": 1234567890.1234567890
        };

        const tokens = tokenize(jsonObj);

        expect(tokens).to.deep.equal([
            {
                parent: undefined,
                name: "decimal",
                _type: "Decimal",
                value: 1234567890.1234567890
            }
        ]);
    });

    it("Should tokenize null values", () => {
        const jsonObj = {
            "nullValue": null
        };

        const tokens = tokenize(jsonObj);

        expect(tokens).to.deep.equal([
            {
                parent: undefined,
                name: "nullValue",
                _type: "null",
                value: null
            }
        ]);
    });

    it("Should tokenize boolean values", () => {
        const jsonObj = {
            "trueValue": true,
            "falseValue": false
        };

        const tokens = tokenize(jsonObj);

        expect(tokens).to.deep.equal([
            {
                parent: undefined,
                name: "trueValue",
                _type: "Boolean",
                value: true
            },
            {
                parent: undefined,
                name: "falseValue",
                _type: "Boolean",
                value: false
            }
        ]);
    });

    it("Should tokenize nested objects", () => {
        const jsonObj = {
            "nestedObject": {
                "key1": "value1",
                "key2": 2
            }
        };

        const tokens = tokenize(jsonObj);

        expect(tokens).to.deep.equal([
            {
                parent: undefined,
                name: "nestedObject",
                _type: "Object",
                value: null
            },
            {
                parent: "nestedObject",
                name: "key1",
                _type: "String",
                value: "value1"
            },
            {
                parent: "nestedObject",
                name: "key2",
                _type: "Integer",
                value: 2
            }
        ]);
    });

    it("Should tokenize deeply nested objects", () => {
        const jsonObj = {
            "deeplyNested": {
                "level1": {
                    "level2": {
                        "key": "value"
                    }
                }
            }
        };

        const tokens = tokenize(jsonObj);

        expect(tokens).to.deep.equal([
            {
                parent: undefined,
                name: "deeplyNested",
                _type: "Object",
                value: null
            },
            {
                parent: "deeplyNested",
                name: "level1",
                _type: "Object",
                value: null
            },
            {
                parent: "deeplyNested.level1",
                name: "level2",
                _type: "Object",
                value: null
            },
            {
                parent: "deeplyNested.level1.level2",
                name: "key",
                _type: "String",
                value: "value"
            }
        ]);
    });

    it("Should tokenize objects with multiple key types", () => {
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

        const tokens = tokenize(jsonObj);

        expect(tokens).to.deep.equal([
            {
                parent: undefined,
                name: "mixedTypes",
                _type: "Object",
                value: null
            },
            {
                parent: "mixedTypes",
                name: "string",
                _type: "String",
                value: "value"
            },
            {
                parent: "mixedTypes",
                name: "number",
                _type: "Integer",
                value: 42
            },
            {
                parent: "mixedTypes",
                name: "boolean",
                _type: "Boolean",
                value: true
            },
            {
                parent: "mixedTypes",
                name: "null",
                _type: "null",
                value: null
            },
            {
                parent: "mixedTypes",
                name: "object",
                _type: "Object",
                value: null
            },
            {
                parent: "mixedTypes.object",
                name: "key",
                _type: "String",
                value: "value"
            }
        ]);
    });

    it("Should tokenize arrays", () => {
        const jsonObj = {
            "array": [
                "value1",
                "value2",
                "value3"
            ]
        };

        const tokens = tokenize(jsonObj);

        expect(tokens).to.deep.equal([
            {
                parent: undefined,
                name: "array",
                _type: "Array",
                value: null
            },
            {
                parent: "array",
                name: undefined,
                _type: "String",
                value: "value1"
            },
            {
                parent: "array",
                name: undefined,
                _type: "String",
                value: "value2"
            },
            {
                parent: "array",
                name: undefined,
                _type: "String",
                value: "value3"
            }
        ])
    });
});