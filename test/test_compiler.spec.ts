import { expect } from 'chai';
import { compile } from '../lib/compiler/compiler.js';

describe("Synthetic tests for the analyzer -> parser -> generator pipeline", () => {
    it("Should generate tests for objects with string values", () => {
        const json = `{
            "string": "Hello, world!"
        }`;

        const result = compile(json);

        let expectedResult = "given()" +
            "\n    " +
            ".when()" +
            "\n    " +
            ".then()" +
            "\n    " +
            ".body(\"string\", equalTo(\"Hello, world!\"));";
        expect(result).to.equal(expectedResult);
    });
});