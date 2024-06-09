export type Parser = (tokens: Token[]) => JsonBodyTest[];

export type JsonBodyTest = {
    testType: TestType,
    path: string,
    value: any,
    valueType: TokenType,
}

export type TestType =
    | "CheckForValue"