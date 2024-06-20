import { expect } from 'chai';
import { JsonBodyTest } from '../types/compiler/parser.js';
import { generateTests, VarOrValue } from '../lib/compiler/generator.js';
import { HTTPMethod } from '../types/compiler/generator.js';

describe("Tests for the generator", () => {
    describe("Tests for the generator test types", () => {
        const options = {
            format: false
        };

        it("Should generate tests with string values", () => {
            const items: JsonBodyTest[] = [
                {
                    testType: "CheckForValue",
                    path: "Hello, world!",
                    value: "Hello, world!",
                    valueType: "String"
                }
            ];

            const expectedResult = "given()" +
                ".when()" +
                ".then()" +
                ".body(\"Hello, world!\", equalTo(\"Hello, world!\"));";
            const result = generateTests(items, options);

            expect(result).to.equal(expectedResult);
        })

        it("Should generate tests with number values", () => {
            const items: JsonBodyTest[] = [
                {
                    testType: "CheckForValue",
                    path: "number",
                    value: 123,
                    valueType: "Number"
                }
            ];

            const expectedResult = "given()" +
                ".when()" +
                ".then()" +
                ".body(\"number\", equalTo(123));";
            const result = generateTests(items, options);

            expect(result).to.equal(expectedResult);
        });

        it("Should generate tests with boolean values", () => {
            const items: JsonBodyTest[] = [
                {
                    testType: "CheckForValue",
                    path: "boolean",
                    value: true,
                    valueType: "Boolean"
                }
            ];

            const expectedResult = "given()" +
                ".when()" +
                ".then()" +
                ".body(\"boolean\", equalTo(true));";
            const result = generateTests(items, options);

            expect(result).to.equal(expectedResult);
        });

        it("Should generate tests with null values", () => {
            const items: JsonBodyTest[] = [
                {
                    testType: "CheckForNull",
                    path: "null",
                }
            ];

            const expectedResult = "given()" +
                ".when()" +
                ".then()" +
                ".body(\"null\", nullValue());";
            const result = generateTests(items, options);

            expect(result).to.equal(expectedResult);
        });

        it(("Should generate tests for array item checks"), () => {

            const items: JsonBodyTest[] = [
                {
                    testType: "CheckArrayItems",
                    path: "array",
                    items: [
                        { value: "Hello, world!", valueType: "String" },
                        { value: 123, valueType: "Number" },
                    ]
                }
            ];

            const expectedResult = "given()" +
                ".when()" +
                ".then()" +
                ".body(\"array\", arrayContaining(\"Hello, world!\", 123));";

            const result = generateTests(items, options);

            expect(result).to.equal(expectedResult);
        });
    });

    describe("Tests for the request specification options", () => {
        it("Should generate tests with accept header", () => {
            const items: JsonBodyTest[] = [
                {
                    testType: "CheckForValue",
                    path: "Hello, world!",
                    value: "Hello, world!",
                    valueType: "String"
                }
            ];
            const options = {
                format: false,
                request: {
                    accept: new VarOrValue("application/json").asValue()
                }
            };
            const result = generateTests(items, options);

            const expectedResult = "given()" +
                ".accept(\"application/json\")" +
                ".when()" +
                ".then()" +
                ".body(\"Hello, world!\", equalTo(\"Hello, world!\"));";
            expect(result).to.equal(expectedResult);
        })

        it("Should generate tests with content type", () => {
            const items: JsonBodyTest[] = [
                {
                    testType: "CheckForValue",
                    path: "Hello, world!",
                    value: "Hello, world!",
                    valueType: "String"
                }
            ];
            const options = {
                format: false,
                request: {
                    contentType: new VarOrValue("application/json").asValue()
                }
            };
            const result = generateTests(items, options);

            const expectedResult = "given()" +
                ".contentType(\"application/json\")" +
                ".when()" +
                ".then()" +
                ".body(\"Hello, world!\", equalTo(\"Hello, world!\"));";
            expect(result).to.equal(expectedResult);
        })

        it("Should generate tests with request body", () => {
            const items: JsonBodyTest[] = [
                {
                    testType: "CheckForValue",
                    path: "Hello, world!",
                    value: "Hello, world!",
                    valueType: "String"
                }
            ];
            const options = {
                format: false,
                request: {
                    body: new VarOrValue('{"key":"value"}').asValue()
                }
            };
            const result = generateTests(items, options);

            const expectedResult = "given()" +
                ".body(\"{\"key\":\"value\"}\")" +
                ".when()" +
                ".then()" +
                ".body(\"Hello, world!\", equalTo(\"Hello, world!\"));";
            expect(result).to.equal(expectedResult);
        })

        it("Should generate tests with headers", () => {
            const items: JsonBodyTest[] = [
                {
                    testType: "CheckForValue",
                    path: "Hello, world!",
                    value: "Hello, world!",
                    valueType: "String"
                }
            ];
            const options = {
                format: false,
                request: {
                    headers: new Map([
                        [new VarOrValue("X-Header-1").asValue(), new VarOrValue("value1").asValue()],
                        [new VarOrValue("X-Header-2").asValue(), new VarOrValue("value2").asValue()]
                    ])
                }
            };
            const result = generateTests(items, options);

            const expectedResult = "given()" +
                ".header(\"X-Header-1\", \"value1\")" +
                ".header(\"X-Header-2\", \"value2\")" +
                ".when()" +
                ".then()" +
                ".body(\"Hello, world!\", equalTo(\"Hello, world!\"));";
            expect(result).to.equal(expectedResult);
        })

        it("Should generate tests with cookies", () => {
            const items: JsonBodyTest[] = [
                {
                    testType: "CheckForValue",
                    path: "Hello, world!",
                    value: "Hello, world!",
                    valueType: "String"
                }
            ];
            const options = {
                format: false,
                request: {
                    cookies: new Map([
                        [new VarOrValue("cookie1").asValue(), new VarOrValue("value1").asValue()],
                        [new VarOrValue("cookie2").asValue(), new VarOrValue("value2").asValue()]
                    ])
                }
            };
            const result = generateTests(items, options);

            const expectedResult = "given()" +
                ".cookie(\"cookie1\", \"value1\")" +
                ".cookie(\"cookie2\", \"value2\")" +
                ".when()" +
                ".then()" +
                ".body(\"Hello, world!\", equalTo(\"Hello, world!\"));";
            expect(result).to.equal(expectedResult);
        })

        it("Should generate tests with params", () => {
            const items: JsonBodyTest[] = [
                {
                    testType: "CheckForValue",
                    path: "Hello, world!",
                    value: "Hello, world!",
                    valueType: "String"
                }
            ];
            const options = {
                format: false,
                request: {
                    params: new Map([
                        [new VarOrValue("param1").asValue(), new VarOrValue("value1").asValue()],
                        [new VarOrValue("param2").asValue(), new VarOrValue("value2").asValue()]
                    ])
                }
            };
            const result = generateTests(items, options);

            const expectedResult = "given()" +
                ".param(\"param1\", \"value1\")" +
                ".param(\"param2\", \"value2\")" +
                ".when()" +
                ".then()" +
                ".body(\"Hello, world!\", equalTo(\"Hello, world!\"));";
            expect(result).to.equal(expectedResult);
        })

        it("Should generate tests with HTTP method and URL", () => {
            const items: JsonBodyTest[] = [
                {
                    testType: "CheckForValue",
                    path: "Hello, world!",
                    value: "Hello, world!",
                    valueType: "String"
                }
            ];
            const options = {
                format: false,
                request: {
                    method: "GET" as HTTPMethod,
                    url: new VarOrValue("/api/endpoint").asValue()
                }
            };
            const result = generateTests(items, options);

            const expectedResult = "given()" +
                ".when()" +
                ".get(\"/api/endpoint\")" +
                ".then()" +
                ".body(\"Hello, world!\", equalTo(\"Hello, world!\"));";
            expect(result).to.equal(expectedResult);
        })

        it("Should generate tests with port", () => {
            const items: JsonBodyTest[] = [
                {
                    testType: "CheckForValue",
                    path: "Hello, world!",
                    value: "Hello, world!",
                    valueType: "String"
                }
            ];
            const options = {
                format: false,
                request: {
                    port: new VarOrValue(8080).asValue()
                }
            };
            const result = generateTests(items, options);

            const expectedResult = "given()" +
                ".when()" +
                ".port(8080)" +
                ".then()" +
                ".body(\"Hello, world!\", equalTo(\"Hello, world!\"));";
            expect(result).to.equal(expectedResult);
        })

        it("Should generate tests with references to variables", () => {
            const items: JsonBodyTest[] = [
                {
                    testType: "CheckForValue",
                    path: "Hello, world!",
                    value: "Hello, world!",
                    valueType: "String"
                }]

            const requestSpec = {
                method: "POST" as HTTPMethod,
                url: new VarOrValue("endpoint").asVar(),
                contentType: new VarOrValue("MediaType.APPLICATION_JSON").asVar(),
                headers: new Map([
                    [new VarOrValue("X-Header-1").asValue(), new VarOrValue("header1").asVar()],
                    [new VarOrValue("X-Header-2").asValue(), new VarOrValue("header2").asVar()]
                ]),
                cookies: new Map([
                    [new VarOrValue("cookie").asValue(), new VarOrValue("someCookie").asVar()]
                ]),
                params: new Map([
                    [new VarOrValue("param1").asValue(), new VarOrValue("firstParameter").asVar()],
                    [new VarOrValue("param2").asValue(), new VarOrValue("secondParameter").asVar()]
                ]),
                body: new VarOrValue("body").asVar(),
            }
            const options = {
                format: false,
                request: requestSpec
            };

            const result = generateTests(items, options);

            const expectedResult = "given()" +
                ".body(body)" +
                ".contentType(MediaType.APPLICATION_JSON)" +
                ".cookie(\"cookie\", someCookie)" +
                ".header(\"X-Header-1\", header1)" +
                ".header(\"X-Header-2\", header2)" +
                ".param(\"param1\", firstParameter)" +
                ".param(\"param2\", secondParameter)" +
                ".when()" +
                ".post(endpoint)" +
                ".then()" +
                ".body(\"Hello, world!\", equalTo(\"Hello, world!\"));";

            expect(result).to.equal(expectedResult);

        });

    });
});