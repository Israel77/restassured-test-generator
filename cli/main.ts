#!/usr/bin/env node

import { Option, OptionValues, program } from 'commander';
import { readFileSync } from "fs";
import { compile } from '../lib/compiler/compiler.js';
import { CompilerOptions } from '../lib/types/compiler/compiler.js';
import { VarOrValue } from '../lib/compiler/generator.js';
import { HTTPMethod } from '../lib/types/compiler/generator.js';

program
    .addOption(new Option("-f, --file <file>", "File with JSON response body"))
    .option("-s, --string <body>", "String representing JSON response body")
    .option("-sc, --status-code <code>", "HTTP status code", parseInt);

// Options for each one of the HTTP methods
program
    .addOption(new Option("--post <url>", "URL of the POST request")
        .conflicts("--delete")
        .conflicts("--get")
        .conflicts("--head")
        .conflicts("--options")
        .conflicts("--patch")
        .conflicts("--put")
    )
    .addOption(new Option("--get <url>", "URL of the GET request")
        .conflicts("--delete")
        .conflicts("--post")
        .conflicts("--head")
        .conflicts("--options")
        .conflicts("--patch")
        .conflicts("--put")
    )
    .addOption(new Option("--put <url>", "URL of the PUT request")
        .conflicts("--delete")
        .conflicts("--get")
        .conflicts("--head")
        .conflicts("--options")
        .conflicts("--patch")
        .conflicts("--post")
    )
    .addOption(new Option("--delete <url>", "URL of the DELETE request")
        .conflicts("--post")
        .conflicts("--get")
        .conflicts("--head")
        .conflicts("--options")
        .conflicts("--patch")
        .conflicts("--put")
    )
    .addOption(new Option("--patch <url>", "URL of the PATCH request")
        .conflicts("--delete")
        .conflicts("--get")
        .conflicts("--head")
        .conflicts("--options")
        .conflicts("--post")
        .conflicts("--put")
    )
    .addOption(new Option("--head <url>", "URL of the HEAD request")
        .conflicts("--delete")
        .conflicts("--get")
        .conflicts("--post")
        .conflicts("--options")
        .conflicts("--patch")
        .conflicts("--put")
    )
    .addOption(new Option("--options <url>", "URL of the OPTIONS request")
        .conflicts("--delete")
        .conflicts("--get")
        .conflicts("--head")
        .conflicts("--post")
        .conflicts("--patch")
        .conflicts("--put")
    );

program.parse();

const programOptions = program.opts();

const main = (programOptions: OptionValues) => {
    if (!programOptions.file && !programOptions.string) {
        console.error("No file or string provided");
        return;
    }

    const body: string = programOptions.string ? programOptions.string : readFileSync(programOptions.file, "utf-8");

    const httpMethod = getMethodAndUrl(programOptions).method;
    const url = getMethodAndUrl(programOptions).url;

    const compilerOptions: CompilerOptions = {
        simplify: true,
        generatorOptions: {
            statusCode: Number.isNaN(programOptions.statusCode) ? undefined : programOptions.statusCode,
            request: {
                method: httpMethod,
                url: url ? new VarOrValue(url).asValue() : undefined
            }
        }
    }

    console.log(compile(body, compilerOptions));
}

const getMethodAndUrl = (programOptions: OptionValues): { method?: HTTPMethod, url?: string } => {
    let method: HTTPMethod | undefined;

    if (programOptions.post) {
        method = "POST";
    } else if (programOptions.get) {
        method = "GET";
    } else if (programOptions.put) {
        method = "PUT";
    } else if (programOptions.delete) {
        method = "DELETE";
    } else if (programOptions.patch) {
        method = "PATCH";
    } else if (programOptions.head) {
        method = "HEAD";
    } else if (programOptions.options) {
        method = "OPTIONS";
    } else {
        method = undefined;
    }

    const url = method ? programOptions[method.toLowerCase()] : undefined;

    return { method, url };
}

main(programOptions);