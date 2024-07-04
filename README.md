# RestAssured Test Generator

A transpiler to convert JSON response body to Java RestAssured assertions.

This project contains a library that can be used to generate RestAssured assertions from JSON responses. 

> 🚧 Warning: This is a work in progress and breaking changes shall be expected.


# 1. Installation


If you want to use it as a library, you can install it locally on your project:
```sh
npm install restassured-test-generator
```

# 2. Usage

The project contains a JSON to RestAssured transpiler that will convert a given JSON corresponding to a REST API response to a Java RestAssured assertion. The compiler also accepts a number of options that can be used to customize the generated code. These options include information about status code, headers, cookies, etc. That will be included on the generated assertion.

The transpiler can be imported as a standalone library and used in a JavaScript project. The library exports a Compiler object containing a compile function that accepts a JSON string, being also allowed take additional options for the test generation, and returns a Java RestAssured assertion string.

Example usage:
```js
import { Compiler, VarOrValue } from 'restassured-test-generator';

const jsonString = `{"id": 69420, "name": "John", "age": 42}`;

const compilerOptions = {
    simplify: true,
    generatorOptions: {
        format: true,
        request: {
            method: 'POST',
            url: new VarOrValue('https://example.com').asValue(),
            statusCode: 200
        }
    }
};

const output = Compiler.compile(jsonString, compilerOptions);

console.log(output);
// given()
//    .when()
//    .post("https://example.com")
//    .then()
//    .body("id", equalTo(69420))
//    .body("name", equalTo("John Doe"))
//    .body("age", equalTo(42))
//    .statusCode(200);
```

The VarOrValue class is a wrapper around a string that can be either a variable or a value. This is useful when the test body compares against a variable created previously on the Java code, so that the output is not surrounded by quotation marks:

```js
import { Compiler, VarOrValue } from 'restassured-test-generator';

const jsonString = `{"id": 69420, "name": "John", "age": 42}`;

const compilerOptions = {
    simplify: true,
    generatorOptions: {
        format: true,
        request: {
            method: 'POST',
            url: new VarOrValue('https://example.com').asVar(),
            statusCode: 200
        }
    }
};

const output = Compiler.compile(jsonString, compilerOptions);

console.log(output);
// given()
//    .when()
//    .post(url)
//    .then()
//    .body("id", equalTo(69420))
//    .body("name", equalTo("John Doe"))
//    .body("age", equalTo(42))
//    .statusCode(200);

```

The Compiler object also exposes functions that allow access to the different steps of the transpiler:

```js
import { Compiler } from 'restassured-test-generator';

const jsonString = `{"id": 69420, "name": "John", "age": 30}`;

const fields = Compiler.analyze(jsonString);
const testSpec = Compiler.transform(fields);
const output = Compiler.generateTests(testSpec);
```