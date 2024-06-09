import { VarOrValue } from "../compiler/generator";

export type TestGenerator = (items: JsonBodyTest[], options?: GeneratorOptions) => string;

export type GeneratorOptions = {
    // If present the generated test will include a call to .statusCode method
    statusCode?: number,
    // If true, the generated test will be formatted to be more readable (default: true)
    format?: boolean,
    request?: RequestSpecification,
}

export type RequestSpecification = {
    accept?: VarOrValue<string>,
    body?: VarOrValue<string>,
    contentType?: VarOrValue<string>,
    port?: VarOrValue<number>,
    headers?: Map<VarOrValue<string>, VarOrValue<string>>,
    params?: Map<VarOrValue<string>, VarOrValue<string>>,
    queryParams?: Map<VarOrValue<string>, VarOrValue<string>>,
    method?: VarOrValue<HTTPMethod>,
    url?: VarOrValue<string>,
}

/**
 * Request methods supported by RestAssured.
 */
type HTTPMethod =
    | "GET"
    | "POST"
    | "PUT"
    | "DELETE"
    | "HEAD"
    | "OPTIONS"
    | "PATCH";