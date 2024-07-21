export type JsonType =
    | string
    | number
    | boolean
    | JsonObject
    | readonly JsonType[]
    | null;

// Typescript does not allow record types to be recursive.
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
type JsonObject = { [key: string]: JsonType };