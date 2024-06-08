export type Token = {
    // Parent is the key of the parent object, or undefined if it is the root object
    parent?: string,
    // Name is the key of the current object, or undefined if it is an array element
    key?: string,
    _type: TokenType,
    value: string | number | boolean | Object | any[] | null,
}

export type TokenType =
    | "String"
    | "Integer"
    | "Decimal"
    | "Boolean"
    | "Object"
    | "Array"
    | "null"

