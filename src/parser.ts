import { TestItem, Token } from "./types";
import { tokenize, composeKey } from "./tokenizer.js";

export const parse = (tokens: Token[]): TestItem[] => {
    const items: TestItem[] = [];

    const parentTypes: { [key: string]: "Object" | "Array" } = {};

    for (const token of tokens) {
        if (token.type !== "Object" && token.type !== "Array") {
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