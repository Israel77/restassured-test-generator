import { JsonType } from "../jsonTypes";

export type Tokenizer = (jsonObj: { [key: string]: JsonType }, parent?: string) => Token[];

export type Token = {
    // Parent is the key of the parent object, or undefined if it is the root object
    parent?: string,
    // Key of the current object, or index if it is an array element
    key: string,
    type: TokenType,
    value: JsonType,
}

export type TokenType =
    | "String"
    | "Number"
    | "Boolean"
    | "Object"
    | "Array"
    | "null"