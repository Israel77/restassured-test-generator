export type Token = {
    // Parent is the key of the parent object, or undefined if it is the root object
    parent?: string,
    // Key of the current object, or index if it is an array element
    key: string,
    type: TokenType,
    value: string | number | boolean | Object | any[] | null,
}

export type TokenType =
    | "String"
    | "Number"
    | "Boolean"
    | "Object"
    | "Array"
    | "null"

export type TestItem = {
    testType: TestType,
    path: string,
    value: any,
    valueType: TokenType,
}

export type TestType =
    | "CheckForValue"

export type GeneratorOptions = {
    // If present the generated test will include a call to .statusCode method
    statusCode?: number,
    // If true, the generated test will be formatted to be more readable (default: true)
    format?: boolean
}