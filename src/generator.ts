import { TestItem } from "./types";

export const generateTests = (items: TestItem[]): string => {
    let result = "then()\n";

    for (const item of items) {
        if (item.type === "CheckForValue") {
            result += `    .body("${item.path}", equalTo(${formatValue(item.value)}))\n`;
        }
    }
    result += "    .statusCode(200);"
    return result;
}

const formatValue = (value: any): string | undefined => {
    switch (typeof value) {
        case "string":
            return `"${value}"`;
        case "number":
        case "boolean":
            return value.toString();
        case "object":
            if (value === null) {
                return "null";
            }
            break;
        default:
            throw new Error("Unsupported value type");
    }
}