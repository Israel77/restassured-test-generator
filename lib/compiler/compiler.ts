import { generateTests } from "./generator.js";
import { parse } from "./parser.js";
import { analyze } from "./analyzer.js";

export const compile = (json: string): string =>
    generateTests(parse(analyze(JSON.parse(json))));
