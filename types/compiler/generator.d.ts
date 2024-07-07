import { JsonBodyTest } from "./transformer";
import { Var } from "./utils";

export type TestGenerator = (items: JsonBodyTest[], options?: GeneratorOptions) => string;

export type GeneratorOptions = {
    // If present the generated test will include a call to .statusCode method
    statusCode?: number,
    // If true, the generated test will be formatted to be more readable (default: true)
    format?: boolean,
    // If true, the generated test will include the dependencies required by the test (default: false)
    includeDependencies?: boolean,
    request?: RequestSpecification,
}

export type RequestSpecification = {
    accept?: string | Var,
    body?: string | Var,
    contentType?: string | Var,
    cookies?: Map<string | Var, string | Var>,
    headers?: Map<string | Var, string | Var>,
    method?: HTTPMethod,
    params?: Map<string | Var, string | Var>,
    port?: number | Var,
    queryParams?: Map<string | Var, string | Var>,
    url?: string | Var,
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