import { JsonType } from "../jsonTypes";

export type Analyzer = (jsonObj: { [key: string]: JsonType }, parent?: string) => JsonField[];

export type JsonField = {
    // Parent is the key of the parent object, or undefined if it is the root object
    parent?: string,
    // Key of the current object, or index if it is an array element
    key: string,
    type: FieldType,
    value: JsonType,
}

export type FieldType =
    | "String"
    | "Number"
    | "Boolean"
    | "Object"
    | "Array"
    | "null"