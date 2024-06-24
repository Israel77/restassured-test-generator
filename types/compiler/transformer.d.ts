import { JsonType } from "../jsonTypes";
import { JsonField, FieldType } from "./analyzer";

export type Transformer = (tokens: JsonField[], simplify?: boolean) => JsonBodyTest[];

export type JsonBodyTest =
    | CheckForValue
    | CheckForNull
    | CheckArrayItems
    | CheckForEmpty;

type CheckForValue = {
    testType: "CheckForValue",
    path: string,
    value: JsonType,
    valueType: FieldType,
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
        valueType: FieldType,
    }[]
}

type CheckForEmpty = {
    testType: "CheckForEmpty",
    path: string,
}

export type TestType =
    | "CheckForValue"
    | "CheckForNull"
    | "CheckArrayItems"
    | "CheckForEmpty";