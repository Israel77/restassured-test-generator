# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

[Unreleased]
## Added
- Create CI pipeline using GitHub actions.
- Add tests for the utility functions and classes.
- Export the Var class declaration to match index.js when using typescript.
- Add option to generate the Java imports needed for the tests.

## Changed
- Throw explicit error when non-supported type is passed to the transpiler.
- Make the callee responsible for handling errors thrown by the transpiler.

[0.0.8] - 2024-07-06
## Changed
- Start using release candidates to avoid publishing broken builds.

## Fixed
- Remove tests directory from the published files.

[0.0.7] - 2024-07-03
## Removed
- BREAKING CHANGE: Removed the CLI to focus on the transpiler library development and the frontend via VSCode extension. In the future it might be reintroduced but probably on a separate repository, so that the transpiler can be used as a pure JavaScript/TypeScript library with no external dependencies.

## Changed
- BREAKING CHANGE: Removed the VarOrValue class and replaced with a simple Var class when needed. Creating a generic class was an overkill and didn't reflect the semantics of code properly, when realistically, a wrapper was only needed for the string type. Functions that accept both variables and other types can work by simply using TypeScript type unions. The new simpler class also works better when importing the library into a pure JS project.

[0.0.6] - 2024-06-24
## Fixed
- Fix previous release, which did not had all the typescript files compiled

[0.0.5] - 2024-06-24
## Changed
- Change test generation strategy for empty objects and arrays.
- Don't generate tests for arrays that only contains inner objects, as it would be an empty test, and the inner fields already have their tests.
- Removed documentation regarding the internal project architecture, as it is still in a early stage and can change at any time.

## Fixed
- Fixed bug when generating paths for deeply nested combinations of arrays and objects.
- Change arrayContaining matcher to hasItems on the output code when testing arrays, as it is more consistent with the way RestAssured traverses the JSON body.

[0.0.4] - 2024-06-23
## Fixed
- Add .js extension to imports, so that the output JavaScript code for the library works correctly.
- Fix some typos on README.
- Accept array as root of JSON object.

## Changed
- Changed name of parser step to transformer, since it doesn't really parse anything but transforms JSON data into test data.
- Separate ongoing development from master branch.

[0.0.3] - 2024-06-22
## Changed
- Separated type declarations from the lib directory.
- Removed node-specific type assertion in favor of typescript compile-time type assertion.

[0.0.2] - 2024-06-16

## Added
- Created changelog to keep track of changes in the project development.

## Fixed
- Fixed wrong import on generator.ts

[0.0.1] - 2024-06-16

## Added
- Initial release
