import { JsonType } from "../jsonTypes";

export type Parser = (tokens: Token[]) => JsonBodyTest[];

export type JsonBodyTest = {
    testType: TestType,
    path: string,
    value: JsonType,
    valueType: TokenType,
}

export type TestType =
    | "CheckForValue"