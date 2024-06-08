import { GeneratorOptions, TestItem, TokenType } from "./types";

export const generateTests = (items: TestItem[], options?: GeneratorOptions): string => {
    options = {
        format: true,
        ...options
    };

    let sep = options.format ? "\n    " : "";
    let end = ";";

    let result = "then()";

    for (const item of items) {
        if (item.testType === "CheckForValue") {
            result += sep +
                `.body("${item.path}", equalTo(${formatValue(item.value, item.valueType)}))`;
        }
    }

    if (options.statusCode !== undefined) {
        result += sep + `.statusCode(${options.statusCode})`;
    }

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