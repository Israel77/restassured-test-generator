export declare class Var {
    constructor(name: string);
    unwrap(): string;
    map(fn: (name: string) => string): Var;
}