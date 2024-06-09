import { assert } from "chai";
import { GeneratorOptions, TestGenerator, RequestSpecification } from "../types/generator";
import { JsonBodyTest } from "../types/parser";
import { TokenType } from "../types/tokenizer";

/**
 * If isVar is true, value will be intepreted as a variable in the generated test.
 */
export class VarOrValue<T> {
    private value: T
    private isVar: boolean

    constructor(value: T) {
        this.value = value;
        this.isVar = false;
    }

    asVar(): VarOrValue<T> {
        this.isVar = true;
        return this;
    }

    asValue(): VarOrValue<T> {
        this.isVar = false;
        return this;
    }

    unwrap(): T | string {
        if (this.isVar || typeof this.value !== "string") {
            return this.value;
        } else {
            assert(typeof this.value === "string");
            return `"${this.value}"`;
        }
    }
}

export const generateTests: TestGenerator = (responseTestItems, options?) => {
    options = {
        format: true,
        ...options
    };

    let indent = options.format ? "    " : "";
    let newline = options.format ? "\n" : "";
    let end = ";";

    let result = "";

    result += generateRequestSpecification(options.request, newline, indent);

    result += generateResponseTests(responseTestItems, newline, indent, options);

    result += end;
    return result;
}

const formatValue = (value: any, type: TokenType): string | undefined => {
    const JAVA_MAX_INT = 2_147_483_647;

    switch (type) {
        case "String":
            return `"${value}"`;
        case "Number":
            if (!Number.isInteger(value)) {
                return `${value}f`;
            } else if (value > JAVA_MAX_INT) {
                return `${value}L`;
            } else {
                return value.toString();
            }
        case "Boolean":
            return value.toString();
        case "null":
            return "null";
        default:
            throw new Error("Unsupported value type");
    }
}

const generateRequestSpecification = (request: RequestSpecification | undefined,
    newline: string,
    indent: string): string => {
    let result = "given()";

    if (request?.accept) {
        result += newline + indent +
            `.accept(${request.accept.unwrap()})`;
    }

    if (request?.contentType) {
        result += newline + indent +
            `.contentType(${request.contentType.unwrap()})`;
    }

    if (request?.body) {
        result += newline + indent +
            `.body(${request.body.unwrap()})`;
    }

    for (const header of request?.headers ?? []) {
        const key = header[0].unwrap();
        const value = header[1].unwrap();

        result += newline + indent +
            `.header(${key}, ${value})`;
    }

    for (const cookie of request?.cookies ?? []) {
        const key = cookie[0].unwrap();
        const value = cookie[1].unwrap();

        result += newline + indent +
            `.cookie(${key}, ${value})`;
    }

    for (const parameter of request?.params ?? []) {
        const key = parameter[0].unwrap();
        const value = parameter[1].unwrap();

        result += newline + indent +
            `.param(${key}, ${value})`;
    }

    for (const parameter of request?.params ?? []) {
        const key = parameter[0].unwrap();
        const value = parameter[1].unwrap();

        result += newline + indent +
            `.param(${key}, ${value})`;
    }

    result += newline + ".when()";

    if (request?.method) {
        const _method = request.method
            // Hack to always interpret as method call, not string
            .asVar()
            .unwrap().toLowerCase();
        result += newline + indent +
            `.${_method}(${request.url?.unwrap()})`;
    }

    if (request?.port) {
        result += newline + indent +
            `.port(${request.port.unwrap()})`;
    }

    return result;
}

const generateResponseTests = (responseTestItems: JsonBodyTest[], newline: string, indent: string, options: GeneratorOptions): string => {
    let result = "";

    result += newline + ".then()";

    for (const item of responseTestItems) {
        if (item.testType === "CheckForValue") {
            result += newline + indent +
                `.body("${item.path}", equalTo(${formatValue(item.value, item.valueType)}))`;
        }
    }

    if (options.statusCode !== undefined) {
        result += newline + indent +
            `.statusCode(${options.statusCode})`;
    }

    return result;
}