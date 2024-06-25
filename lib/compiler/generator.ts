import { GeneratorOptions, TestGenerator, RequestSpecification } from "../../types/compiler/generator";
import { JsonBodyTest } from "../../types/compiler/transformer";
import { FieldType } from "../../types/compiler/analyzer";
import { JsonType } from "../../types/jsonTypes";
import { isBoolean, isNumber, isString } from "./utils.js";

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
            isString(this.value);
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

const formatValue = (value: JsonType, type: FieldType): string | undefined => {
    const JAVA_MAX_INT = 2_147_483_647;

    switch (type) {
        case "String":
            return `"${value}"`;
        case "Number":
            isNumber(value);
            if (!Number.isInteger(value)) {
                return `${value}f`;
            } else if (value > JAVA_MAX_INT) {
                return `${value}L`;
            } else {
                return value.toString();
            }
        case "Boolean":
            isBoolean(value);
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

    // Request parameters
    if (request?.accept) {
        result += newline + indent +
            `.accept(${request.accept.unwrap()})`;
    }

    if (request?.body) {
        result += newline + indent +
            `.body(${request.body.unwrap()})`;
    }

    if (request?.contentType) {
        result += newline + indent +
            `.contentType(${request.contentType.unwrap()})`;
    }

    for (const cookie of request?.cookies ?? []) {
        const key = cookie[0].unwrap();
        const value = cookie[1].unwrap();

        result += newline + indent +
            `.cookie(${key}, ${value})`;
    }

    for (const header of request?.headers ?? []) {
        const key = header[0].unwrap();
        const value = header[1].unwrap();

        result += newline + indent +
            `.header(${key}, ${value})`;
    }


    for (const parameter of request?.params ?? []) {
        const key = parameter[0].unwrap();
        const value = parameter[1].unwrap();

        result += newline + indent +
            `.param(${key}, ${value})`;
    }

    for (const parameter of request?.queryParams ?? []) {
        const key = parameter[0].unwrap();
        const value = parameter[1].unwrap();

        result += newline + indent +
            `.queryParam(${key}, ${value})`;
    }

    // Request endpoint
    result += newline + indent + ".when()";

    if (request?.method) {
        result += newline + indent +
            `.${request.method.toLowerCase()}(${request.url?.unwrap()})`;
    }

    if (request?.port) {
        result += newline + indent +
            `.port(${request.port.unwrap()})`;
    }

    return result;
}

const generateResponseTests = (responseTestItems: JsonBodyTest[], newline: string, indent: string, options: GeneratorOptions): string => {
    let result = "";

    result += newline + indent + ".then()";

    for (const item of responseTestItems) {
        switch (item.testType) {
            case "CheckForValue":
                result += newline + indent +
                    `.body("${item.path}", equalTo(${formatValue(item.value, item.valueType)}))`;
                break;

            case "CheckForNull":
                result += newline + indent +
                    `.body("${item.path}", nullValue())`;
                break;

            case "CheckArrayItems":
                result += newline + indent +
                    `.body("${item.path}", hasItems(${item.items.map(v => formatValue(v.value, v.valueType)).join(", ")}))`;
                break;

            case "CheckForEmpty":
                result += newline + indent +
                    `.body("${item.path}", empty())`;
                break;
        }
    }

    if (options.statusCode !== undefined) {
        result += newline + indent +
            `.statusCode(${options.statusCode})`;
    }

    return result;
}