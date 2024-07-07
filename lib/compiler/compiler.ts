import { generateTests } from "./generator.js";
import { transform } from "./transformer.js";
import { analyze } from "./analyzer.js";
import { JsonType } from "../../types/jsonTypes.js";
import { CompilerOptions } from "../../types/compiler/compiler.js";

/**
 * Compiles a JSON string into a set of tests.
 *
 * @param json - The JSON string to compile.
 * @param compilerOptions - Optional compiler options.
 * @returns The generated tests as a string.
 * @throws {SyntaxError} If the JSON string is invalid.
 */
export const compile = (json: string, compilerOptions?: CompilerOptions): string => {
    const jsonObj: { [key: string]: JsonType } =
        JSON.parse(json);

    return generateTests(
        transform(analyze(jsonObj), compilerOptions?.simplify),
        compilerOptions?.generatorOptions);
}