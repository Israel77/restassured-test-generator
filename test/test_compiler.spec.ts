import { expect } from 'chai';
import { compile } from '../lib/compiler/compiler.js';
import { CompilerOptions } from '../types/compiler/compiler.js';
import { Var } from '../lib/compiler/utils.js';

describe("Synthetic tests for the analyzer -> parser -> generator pipeline", () => {
  it("Should generate tests for objects with string values", () => {
    const json = `{
            "string": "Hello, world!"
        }`;

    const result = compile(json);

    let expectedResult = "given()" +
      "\n    " +
      ".when()" +
      "\n    " +
      ".then()" +
      "\n    " +
      ".body(\"string\", equalTo(\"Hello, world!\"));";
    expect(result).to.equal(expectedResult);
  });

  // FIXME: Deeply nested arrays inside objects do not generate correct output
  it("Should generate tests for complex objects", () => {
    const json = `
    {
      "list": [
        "hello",
        "world"
      ],
      "listOfLists": [
        [
          "a",
          "b",
          "c"
        ],
        [
          "d",
          "e",
          "f"
        ]
      ],
      "people": [
        {
          "id": 1,
          "name": "John",
          "height": 1.85,
          "friends": [
            2,
            3,
            4
          ]
        },
        {
          "id": 2,
          "name": "Jane",
          "height": 1.75,
          "friends": [
            1,
            3,
            4
          ]
        },
        {
          "id": 3,
          "name": "Bob",
          "height": 1.95,
          "friends": [
            1,
            2,
            4,
            5
          ]
        },
        {
          "id": 4,
          "name": "Alice",
          "height": 1.65,
          "friends": [
            2,
            3
          ]
        },
        {
          "id": 5,
          "name": "Eve",
          "height": 1.55,
          "friends": [
            3
          ]
        }
      ]
    }
    `

    const expectedResult = `given()
    .when()
    .get("/complex/object")
    .then()
    .body("list[0]", equalTo("hello"))
    .body("list[1]", equalTo("world"))
    .body("listOfLists[0][0]", equalTo("a"))
    .body("listOfLists[0][1]", equalTo("b"))
    .body("listOfLists[0][2]", equalTo("c"))
    .body("listOfLists[1][0]", equalTo("d"))
    .body("listOfLists[1][1]", equalTo("e"))
    .body("listOfLists[1][2]", equalTo("f"))
    .body("people[0].id", equalTo(1))
    .body("people[0].name", equalTo("John"))
    .body("people[0].height", equalTo(1.85f))
    .body("people[0].friends[0]", equalTo(2))
    .body("people[0].friends[1]", equalTo(3))
    .body("people[0].friends[2]", equalTo(4))
    .body("people[1].id", equalTo(2))
    .body("people[1].name", equalTo("Jane"))
    .body("people[1].height", equalTo(1.75f))
    .body("people[1].friends[0]", equalTo(1))
    .body("people[1].friends[1]", equalTo(3))
    .body("people[1].friends[2]", equalTo(4))
    .body("people[2].id", equalTo(3))
    .body("people[2].name", equalTo("Bob"))
    .body("people[2].height", equalTo(1.95f))
    .body("people[2].friends[0]", equalTo(1))
    .body("people[2].friends[1]", equalTo(2))
    .body("people[2].friends[2]", equalTo(4))
    .body("people[2].friends[3]", equalTo(5))
    .body("people[3].id", equalTo(4))
    .body("people[3].name", equalTo("Alice"))
    .body("people[3].height", equalTo(1.65f))
    .body("people[3].friends[0]", equalTo(2))
    .body("people[3].friends[1]", equalTo(3))
    .body("people[4].id", equalTo(5))
    .body("people[4].name", equalTo("Eve"))
    .body("people[4].height", equalTo(1.55f))
    .body("people[4].friends[0]", equalTo(3))
    .statusCode(200);`

    const options: CompilerOptions = {
      simplify: false,
      generatorOptions: {
        statusCode: 200,
        request: {
          method: "GET",
          url: "/complex/object",
        }
      }
    }
    const result = compile(json, options);

    expect(result).to.equal(expectedResult);
  });
});