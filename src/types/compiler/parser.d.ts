import { JsonType } from "../jsonTypes";
import { Token, TokenType } from "./tokenizer";

export type Parser = (tokens: Token[], simplify?: boolean) => JsonBodyTest[];

export type JsonBodyTest =
    | CheckForValue
    | CheckForNull
    | CheckArrayItems;

type CheckForValue = {
    testType: "CheckForValue",
    path: string,
    value: JsonType,
    valueType: TokenType,
}

type CheckForNull = {
    testType: "CheckForNull",
    path: string,
}

type CheckArrayItems = {
    testType: "CheckArrayItems",
    path: string,
    items: {
        value: JsonType,
        valueType: TokenType,
    }[]
}

export type TestType =
    | "CheckForValue"
    | "CheckForNull"
    | "CheckArrayItems";