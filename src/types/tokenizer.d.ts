export type Tokenizer = (jsonObj: Object, parent?: string) => Token[];

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