import { expect } from 'chai';
import { JsonBodyTest } from '../src/types/parser';
import { generateTests } from '../src/compiler/generator.js';

describe("Tests for the evaluator", () => {
    it("Should evaluate string values", () => {
        const items: JsonBodyTest[] = [
            {
                testType: "CheckForValue",
                path: "string",
                value: "Hello, world!",
                valueType: "String"
            }
        ];

        const result = generateTests(items, { format: false, statusCode: 200 });

        expect(result).to.equal("given().then().body(\"string\", equalTo(\"Hello, world!\")).statusCode(200);");
    })
});