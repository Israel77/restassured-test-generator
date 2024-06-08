import { expect } from 'chai';
import { TestItem } from '../src/types';
import { generateTests } from '../src/generator.js';

describe("Tests for the evaluator", () => {
    it("Should evaluate string values", () => {
        const items: TestItem[] = [
            {
                testType: "CheckForValue",
                path: "string",
                value: "Hello, world!",
                valueType: "String"
            }
        ];

        const result = generateTests(items);

        expect(result).to.equal("then()\n    .body(\"string\", equalTo(\"Hello, world!\"))\n    .statusCode(200);");
    })
});