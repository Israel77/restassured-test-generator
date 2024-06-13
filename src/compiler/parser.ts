import { JsonBodyTest, Parser } from "../types/compiler/parser";
import { composeKey } from "./tokenizer.js";

export const parse: Parser = tokens => {
    const items: JsonBodyTest[] = [];

    const parentTypes: { [key: string]: "Object" | "Array" } = {};

    for (const token of tokens) {
        if (token.type === "null") {
            items.push({
                testType: "CheckForNull",
                path: composeKey(token.parent, token.key, parentTypes[token.parent ?? ""] === "Array")
            });
        }
        else if (token.type !== "Object" && token.type !== "Array") {
            items.push({
                testType: "CheckForValue",
                path: composeKey(token.parent,
                    token.key,
                    parentTypes[token.parent ?? ""] === "Array"),
                value: token.value,
                valueType: token.type
            });
        }
        else {
            parentTypes[composeKey(token.parent, token.key, token.type === "Array")] = token.type;
        }
    }

    return items;
}