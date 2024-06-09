import { expect } from 'chai';
import { tokenize, composeKey } from '../src/compiler/tokenizer.js';
import { parse } from '../src/compiler/parser.js';
import { generateTests } from '../src/compiler/generator.js';

describe("Tests for the tokenizer -> parser -> evaluator pipeline", () => {
    it("Should generate tests for objects with string values", () => {
        const jsonObj = {
            "string": "Hello, world!"
        };

        const result = generateTests(parse(tokenize(jsonObj)), {
            format: true,
            statusCode: 200
        });

        let expectedResult = "given()";
        expectedResult += "\n";
        expectedResult += ".then()";
        expectedResult += "\n    ";
        expectedResult += ".body(\"string\", equalTo(\"Hello, world!\"))";
        expectedResult += "\n    ";
        expectedResult += ".statusCode(200);";

        expect(result).to.equal(expectedResult);
    });
});