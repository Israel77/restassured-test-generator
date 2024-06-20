import { JsonType } from "../jsonTypes";
import { JsonField, FieldType } from "./analyzer";

export type Parser = (tokens: JsonField[], simplify?: boolean) => JsonBodyTest[];

export type JsonBodyTest =
    | CheckForValue
    | CheckForNull
    | CheckArrayItems;

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

export type TestType =
    | "CheckForValue"
    | "CheckForNull"
    | "CheckArrayItems";