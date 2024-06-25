# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
