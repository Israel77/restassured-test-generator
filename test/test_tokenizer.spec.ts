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
});