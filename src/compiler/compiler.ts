import { generateTests } from "./generator.js";
import { parse } from "./parser.js";
import { tokenize } from "./tokenizer.js";

export const compile = (json: string): string =>
    generateTests(parse(tokenize(JSON.parse(json))));
