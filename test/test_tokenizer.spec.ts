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
                key: "string",
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
                key: "int",
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
                key: "decimal",
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
                key: "nullValue",
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
                key: "trueValue",
                _type: "Boolean",
                value: true
            },
            {
                parent: undefined,
                key: "falseValue",
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
                key: "nestedObject",
                _type: "Object",
                value: null
            },
            {
                parent: "nestedObject",
                key: "key1",
                _type: "String",
                value: "value1"
            },
            {
                parent: "nestedObject",
                key: "key2",
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
                key: "deeplyNested",
                _type: "Object",
                value: null
            },
            {
                parent: "deeplyNested",
                key: "level1",
                _type: "Object",
                value: null
            },
            {
                parent: "deeplyNested.level1",
                key: "level2",
                _type: "Object",
                value: null
            },
            {
                parent: "deeplyNested.level1.level2",
                key: "key",
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
                key: "mixedTypes",
                _type: "Object",
                value: null
            },
            {
                parent: "mixedTypes",
                key: "string",
                _type: "String",
                value: "value"
            },
            {
                parent: "mixedTypes",
                key: "number",
                _type: "Integer",
                value: 42
            },
            {
                parent: "mixedTypes",
                key: "boolean",
                _type: "Boolean",
                value: true
            },
            {
                parent: "mixedTypes",
                key: "null",
                _type: "null",
                value: null
            },
            {
                parent: "mixedTypes",
                key: "object",
                _type: "Object",
                value: null
            },
            {
                parent: "mixedTypes.object",
                key: "key",
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
                key: "array",
                _type: "Array",
                value: null
            },
            {
                parent: "array",
                key: undefined,
                _type: "String",
                value: "value1"
            },
            {
                parent: "array",
                key: undefined,
                _type: "String",
                value: "value2"
            },
            {
                parent: "array",
                key: undefined,
                _type: "String",
                value: "value3"
            }
        ])
    });

    it("Should tokenize arrays of objects", () => {
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
        };

        const tokens = tokenize(jsonObj);

        expect(tokens).to.deep.equal([
            {
                parent: undefined,
                key: "arrayOfObjects",
                _type: "Array",
                value: null
            },
            {
                parent: "arrayOfObjects",
                key: undefined,
                _type: "Object",
                value: null
            },
            {
                parent: "arrayOfObjects",
                key: "key1",
                _type: "String",
                value: "value1"
            },
            {
                parent: "arrayOfObjects",
                key: undefined,
                _type: "Object",
                value: null
            },
            {
                parent: "arrayOfObjects",
                key: "key2",
                _type: "String",
                value: "value2"
            },
            {
                parent: "arrayOfObjects",
                key: "key3",
                _type: "String",
                value: "value3"
            }
        ]);
    });

    it("Should tokenize deeply nested objects in an array", () => {
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

        const tokens = tokenize(jsonObj);

        expect(tokens).to.deep.equal([
            {
                parent: undefined,
                key: "arrayWithNestedObjects",
                _type: "Array",
                value: null
            },
            {
                parent: "arrayWithNestedObjects",
                key: undefined,
                _type: "Object",
                value: null
            },
            {
                parent: "arrayWithNestedObjects",
                key: "level1",
                _type: "Object",
                value: null
            },
            {
                parent: "arrayWithNestedObjects.level1",
                key: "level2",
                _type: "Object",
                value: null
            },
            {
                parent: "arrayWithNestedObjects.level1.level2",
                key: "key",
                _type: "String",
                value: "value"
            }
        ]);
    });

    it("Should tokenize array with multiple values and types", () => {
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

        const tokens = tokenize(jsonObj);

        expect(tokens).to.deep.equals(
            [
                {
                    parent: undefined,
                    key: "arrayWithMultipleValues",
                    _type: "Array",
                    value: null
                },
                {
                    parent: "arrayWithMultipleValues",
                    key: undefined,
                    _type: "String",
                    value: "string"
                },
                {
                    parent: "arrayWithMultipleValues",
                    key: undefined,
                    _type: "Integer",
                    value: 42
                },
                {
                    parent: "arrayWithMultipleValues",
                    key: undefined,
                    _type: "Boolean",
                    value: true
                },
                {
                    parent: "arrayWithMultipleValues",
                    key: undefined,
                    _type: "null",
                    value: null
                },
                {
                    parent: "arrayWithMultipleValues",
                    key: undefined,
                    _type: "Object",
                    value: null
                },
                {
                    parent: "arrayWithMultipleValues",
                    key: "key",
                    _type: "String",
                    value: "value"
                }
            ]
        )
    });
});