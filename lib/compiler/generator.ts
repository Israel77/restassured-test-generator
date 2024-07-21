import { GeneratorOptions, TestGenerator, RequestSpecification } from "../../types/compiler/generator";
import { JsonBodyTest } from "../../types/compiler/transformer";
import { FieldType } from "../../types/compiler/analyzer";
import { JsonType } from "../../types/jsonTypes";
import { Var, isBoolean, isNumber, isString } from "./utils.js";

/**
 * Object containing Java dependencies for test generation.
 */
const JAVA_DEPENDENCIES = {
    /**
     * Hamcrest Matchers dependencies.
     */
    HAMCREST_MATCHERS: {
        EQUAL_TO: "import static org.hamcrest.Matchers.equalTo;\n",
        HAS_ITEMS: "import static org.hamcrest.Matchers.hasItems;\n",
        CONTAINS: "import static org.hamcrest.Matchers.contains;\n",
        NULL_VALUE: "import static org.hamcrest.Matchers.nullValue;\n",
        EMPTY: "import static org.hamcrest.Matchers.empty;\n"
    },
    /**
     * RestAssured dependencies.
     */
    RESTASSURED: {
        GIVEN: "import static io.restassured.RestAssured.given;\n",
        WHEN: "import static io.restassured.RestAssured.when;\n",
    }
} as const;

/**
* Generates test code for REST API responses.
* 
* @param responseTestItems - An array of test items for the API response.
* @param options - Optional configuration for test generation.
* @param options.format - Whether to format the generated code with indentation and newlines. Defaults to true.
* @param options.request - Request specification to be included in the test.
* @param options.includeDependencies - Whether to include import statements for dependencies. Defaults to false.
* @returns A string containing the generated test code.
*/
export const generateTests: TestGenerator = (responseTestItems, options?) => {
    options = {
        format: true,
        ...options
    };

    const dependencies = new Set<string>();
    // All tests start with given
    dependencies.add(JAVA_DEPENDENCIES.RESTASSURED.GIVEN);

    let indent = options.format ? "    " : "";
    let newline = options.format ? "\n" : "";
    let end = ";";

    let result = "";

    result += generateRequestSpecification(options.request, newline, indent);

    result += generateResponseTests(responseTestItems, newline, indent, options, dependencies);

    if (options.includeDependencies) {
        result = generateImports(dependencies) + result;
    }

    result += end;
    return result;
}

// This function formats the values to be suitable for the Java language.
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

        /* c8 ignore start */
        default:
            // This should never happen, it indicates a programming error
            throw new Error("Unsupported value type");
        /* c8 ignore end */
    }
}

// This function generates the request specification for the test.
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

const generateResponseTests = (responseTestItems: JsonBodyTest[], newline: string, indent: string, options: GeneratorOptions, dependencies: Set<string>): string => {
    let result = "";

    result += newline + indent + ".then()";

    // Converts each test item to a matching string representation corresponding to the Java code.
    for (const item of responseTestItems) {
        switch (item.testType) {
            case "CheckForValue":
                result += newline + indent +
                    `.body("${item.path}", equalTo(${formatValue(item.value, item.valueType)}))`;

                dependencies.add(JAVA_DEPENDENCIES.HAMCREST_MATCHERS.EQUAL_TO);
                break;

            case "CheckForNull":
                result += newline + indent +
                    `.body("${item.path}", nullValue())`;

                dependencies.add(JAVA_DEPENDENCIES.HAMCREST_MATCHERS.NULL_VALUE);
                break;

            case "CheckArrayItems":
                result += newline + indent +
                    `.body("${item.path}", contains(${item.items.map(v => formatValue(v.value, v.valueType)).join(", ")}))`;

                dependencies.add(JAVA_DEPENDENCIES.HAMCREST_MATCHERS.CONTAINS);
                break;

            case "CheckForEmpty":
                result += newline + indent +
                    `.body("${item.path}", empty())`;

                dependencies.add(JAVA_DEPENDENCIES.HAMCREST_MATCHERS.EMPTY);
                break;
        }
    }

    if (options.statusCode !== undefined) {
        result += newline + indent +
            `.statusCode(${options.statusCode})`;
    }

    return result;
}

const generateImports = (dependencies: Set<string>): string => {
    let result = "";

    for (const dependency of Array.from(dependencies).sort()) {
        result += dependency;
    }

    result += "//----------\n";
    return result;
}