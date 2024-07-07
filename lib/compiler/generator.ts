import { GeneratorOptions, TestGenerator, RequestSpecification } from "../../types/compiler/generator";
import { JsonBodyTest } from "../../types/compiler/transformer";
import { FieldType } from "../../types/compiler/analyzer";
import { JsonType } from "../../types/jsonTypes";
import { Var, isBoolean, isNumber, isString } from "./utils.js";

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
            `.accept(${request.accept instanceof Var ? request.accept.unwrap() : `"${request.accept}"`})`;
    }

    if (request?.body) {
        result += newline + indent +
            `.body(${request.body instanceof Var ? request.body.unwrap() : `"${request.body}"`})`;
    }

    if (request?.contentType) {
        result += newline + indent +
            `.contentType(${request.contentType instanceof Var ? request.contentType.unwrap() : `"${request.contentType}"`})`;
    }

    for (const cookie of request?.cookies ?? []) {
        const key = cookie[0] instanceof Var ? cookie[0].unwrap() : `"${cookie[0]}"`;
        const value = cookie[1] instanceof Var ? cookie[1].unwrap() : `"${cookie[1]}"`;

        result += newline + indent +
            `.cookie(${key}, ${value})`;
    }

    for (const header of request?.headers ?? []) {
        const key = header[0] instanceof Var ? header[0].unwrap() : `"${header[0]}"`;
        const value = header[1] instanceof Var ? header[1].unwrap() : `"${header[1]}"`;

        result += newline + indent +
            `.header(${key}, ${value})`;
    }


    for (const parameter of request?.params ?? []) {
        const key = parameter[0] instanceof Var ? parameter[0].unwrap() : `"${parameter[0]}"`;
        const value = parameter[1] instanceof Var ? parameter[1].unwrap() : `"${parameter[1]}"`;

        result += newline + indent +
            `.param(${key}, ${value})`;
    }

    for (const parameter of request?.queryParams ?? []) {
        const key = parameter[0] instanceof Var ? parameter[0].unwrap() : `"${parameter[0]}"`;
        const value = parameter[1] instanceof Var ? parameter[1].unwrap() : `"${parameter[1]}"`;

        result += newline + indent +
            `.queryParam(${key}, ${value})`;
    }

    // Request endpoint
    result += newline + indent + ".when()";

    if (request?.method && request.url) {
        result += newline + indent +
            `.${request.method.toLowerCase()}(${request.url instanceof Var ? request.url.unwrap() : `"${request.url}"`})`;
    }

    if (request?.port) {
        result += newline + indent +
            `.port(${request.port instanceof Var ? request.port.unwrap() : request.port})`;
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