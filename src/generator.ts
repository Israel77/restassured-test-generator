import { TestItem, TokenType } from "./types";

export const generateTests = (items: TestItem[]): string => {
    let result = "then()\n";

    for (const item of items) {
        if (item.testType === "CheckForValue") {
            result += `    .body("${item.path}", equalTo(${formatValue(item.value, item.valueType)}))\n`;
        }
    }
    result += "    .statusCode(200);"
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