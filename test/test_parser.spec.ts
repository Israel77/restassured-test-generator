import { expect } from "chai";
import { parse } from "../src/compiler/parser.js";

describe("Tests for the parser", () => {
    it("Should parse string values", () => {
        const tokens = [
            {
                parent: undefined,
                key: "string",
                type: "String",
                value: "Hello, world!"
            }
        ];

        const items = parse(tokens);

        expect(items).to.deep.equal([
            {
                testType: "CheckForValue",
                path: "string",
                value: "Hello, world!",
                valueType: "String"
            }
        ]);
    });

    it("Should parse integer values", () => {
        const tokens = [
            {
                parent: undefined,
                key: "int",
                type: "Number",
                value: 1234567890
            }
        ];

        const items = parse(tokens);

        expect(items).to.deep.equal([
            {
                testType: "CheckForValue",
                path: "int",
                value: 1234567890,
                valueType: "Number"
            }
        ]);
    });

    it("Should parse null values", () => {
        const tokens = [
            {
                parent: undefined,
                key: "nullValue",
                type: "null",
                value: null
            }
        ];

        const items = parse(tokens);

        expect(items).to.deep.equal([
            {
                testType: "CheckForNull",
                path: "nullValue"
            }
        ]);
    });

    it("Should parse nested objects", () => {
        const tokens = [
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

        const items = parse(tokens);

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

    it("Should parse arrays", () => {
        const tokens = [
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

        const items = parse(tokens);

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
});