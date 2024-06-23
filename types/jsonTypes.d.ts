export type JsonType =
    | string
    | number
    | boolean
    | JsonObject
    | readonly JsonType[]
    | null;

type JsonObject = { [key: string]: JsonType };