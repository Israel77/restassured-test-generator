import { JsonType } from "../jsonTypes";

export type Parser = (tokens: Token[]) => JsonBodyTest[];

export type JsonBodyTest =
    { testType: TestType }
    & (
        | CheckForValue
        | CheckForNull
    );

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

export type TestType =
    | "CheckForValue"
    | "CheckForNull";