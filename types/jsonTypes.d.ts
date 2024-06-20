export type JsonType =
    | string
    | number
    | boolean
    | { [key: string]: JsonType }
    | readonly JsonType[]
    | null;