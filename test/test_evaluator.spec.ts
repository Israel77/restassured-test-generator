import { expect } from 'chai';
import { TestItem } from '../src/types';
import { generateTests } from '../src/generator.js';

describe("Tests for the evaluator", () => {
    it("Should evaluate string values", () => {
        const items: TestItem[] = [
            {
                type: "CheckForValue",
                path: "string",
                value: "Hello, world!"
            }
        ];

        const result = generateTests(items);

        expect(result).to.equal("then()\n    .body(\"string\", equalTo(\"Hello, world!\"))\n    .statusCode(200);");
    })
});