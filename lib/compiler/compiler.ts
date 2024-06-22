import { generateTests } from "./generator.js";
import { transform } from "./transformer.js";
import { analyze } from "./analyzer.js";
import { JsonType } from "../../types/jsonTypes.js";
import { CompilerOptions } from "../../types/compiler/compiler.js";

export const compile = (json: string, compilerOptions?: CompilerOptions): string | void => {
    let jsonObj: { [key: string]: JsonType };

    try {
        jsonObj = JSON.parse(json);
    } catch (error) {
        console.error("Invalid JSON\n" + error);
        return;
    }

    return generateTests(
        transform(analyze(jsonObj), compilerOptions?.simplify),
        compilerOptions?.generatorOptions);
}