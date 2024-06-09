import { expect } from 'chai';
import { tokenize } from '../src/compiler/tokenizer.js';
import { parse } from '../src/compiler/parser.js';
import { generateTests, VarOrValue } from '../src/compiler/generator.js';

describe("Tests for the tokenizer -> parser -> generator pipeline", () => {
    it("Should generate tests for objects with string values", () => {
        const jsonObj = {
            "string": "Hello, world!"
        };

        const options = {
            format: true,
            statusCode: 200
        };

        const result = generateTests(parse(tokenize(jsonObj)), options);

        let expectedResult = "given()" +
            "\n    " +
            ".when()" +
            "\n    " +
            ".then()" +
            "\n    " +
            ".body(\"string\", equalTo(\"Hello, world!\"))" +
            "\n    " +
            ".statusCode(200);";

        expect(result).to.equal(expectedResult);
    });
});