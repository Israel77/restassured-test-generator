import { describe, it } from 'mocha';
import { expect } from "chai";
import * as Utils from "../lib/compiler/utils.js";

describe("Tests for utility functions", () => {

    describe("Tests for composeKey", () => {
        it("Should compose a key for a root object", () => {
            const key = Utils.composeKey(undefined, "key", false);
            expect(key).to.equal("key");
        });

        it("Should compose a key for an object", () => {
            const key = Utils.composeKey("parent", "key", false);
            expect(key).to.equal("parent.key");
        });

        it("Should compose a key for an array item", () => {
            const key = Utils.composeKey("parent", "[key]", true);
            expect(key).to.equal("parent[key]");
        });

        it("Should compose a key for an array item when the array is root", () => {
            const key = Utils.composeKey(undefined, "[key]", true);
            expect(key).to.equal("[key]");
        });
    });

    describe("Tests for type assertions", () => {
        it("isString should only accept strings", () => {
            expect(() => Utils.isString("string")).to.not.throw();
            expect(() => Utils.isString(123)).to.throw();
        });

        it("isNumber should only accept numbers", () => {
            expect(() => Utils.isNumber(123)).to.not.throw();
            expect(() => Utils.isNumber("string")).to.throw();
        });

        it("isBoolean should only accept booleans", () => {
            expect(() => Utils.isBoolean(true)).to.not.throw();
            expect(() => Utils.isBoolean("string")).to.throw();
        });

        it("isNull should only accept null", () => {
            expect(() => Utils.isNull(null)).to.not.throw();
            expect(() => Utils.isNull("string")).to.throw();
        });
    });

    describe("Tests for Var", () => {
        it("Should create a Var object", () => {
            const varObj = new Utils.Var("var");

            expect(varObj.unwrap()).to.equal("var");
        });

        it("Should apply map to a Var object", () => {
            const varObj = new Utils.Var("Var");
            const mappedVar = varObj.map((v) => "mapped" + v);

            expect(mappedVar.unwrap()).to.equal("mappedVar");
        });
    });
});