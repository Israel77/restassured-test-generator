#!/usr/bin/env node

import { OptionValues, program } from 'commander';
import { readFile, readFileSync } from "fs";
import { compile } from '../lib/compiler/compiler.js';

program
    .option("-f, --file <file>", "File with JSON response body")
    .option("-s, --string <body>", "String representing JSON response body");

program.parse();

const options = program.opts();

const main = (options: OptionValues) => {
    if (!options.file && !options.string) {
        console.error("No file or string provided");
        return;
    }

    const body: string = options.string ? options.string : readFileSync(options.file, "utf-8");

    console.log(compile(body));
}

main(options);