import { generateTests } from "./generator.js";
import { transform } from "./transformer.js";
import { analyze } from "./analyzer.js";
import { JsonType } from "../../types/jsonTypes.js";
import { CompilerOptions } from "../../types/compiler/compiler.js";

/**
 * Compiles a JSON string into a set of tests.
 * 
 * Internally the compiler is composed by three steps, which can be accessed as individual modules:
 * Analyzer -> Transformer -> Generator
 * 
 * Analyzer: Is responsible for analyzing the JSON string and extracting the relevant information about
 * the fields. There is a one-to-one relationship between the JSON string and the Analyzer output.
 * 
 * Transformer: Is responsible for transforming the Analyzer output into a more suitable format for the
 * Generator. The Transformer output is a set of tests, which can be executed to validate the JSON string.
 * It can optionally simplify some tests or add tests to verify certain properties of the JSON string, so
 * the tests are more comprehensive.
 * All the options for the transformer are included on the compiler options through the transformerOptions
 * field.
 * 
 * Generator: Is responsible for generating the tests from the Transformer output. The Generator output is
 * a string that can be executed as part of a Java test.
 * It can optionally include the dependencies required by the tests, which should be added to the top of the
 * Java file. It also accepts multiple options to generate a fully functional test using the RestAssured library,
 * such as the status code and request specification parameters.
 * All the options for the generator are included on the compiler options through the generatorOptions field.
 * 
 * @param {string} json - The JSON string to compile.
 * @param compilerOptions - Optional compiler options.
 * @returns The generated tests as a string.
 * @throws {SyntaxError} If the JSON string is invalid.
 * @throws {TypeError} If the top element is not an object or array (RFC-4627). Support for ECMA-404 
 * shall be implemented in future versions.
 */
export const compile = (json: string, compilerOptions?: CompilerOptions): string => {
    const jsonObj: Record<string, JsonType> =
        JSON.parse(json);

    if (typeof jsonObj !== "object") {
        throw new TypeError("The compiler currently only supports objects and arrays as top-level types.");
    }

    return generateTests(
        transform(analyze(jsonObj), compilerOptions?.transformerOptions),
        compilerOptions?.generatorOptions);
}