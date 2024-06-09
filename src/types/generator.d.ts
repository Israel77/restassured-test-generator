export type TestGenerator = (items: JsonBodyTest[], options?: GeneratorOptions) => string;

export type GeneratorOptions = {
    // If present the generated test will include a call to .statusCode method
    statusCode?: number,
    // If true, the generated test will be formatted to be more readable (default: true)
    format?: boolean,
}
