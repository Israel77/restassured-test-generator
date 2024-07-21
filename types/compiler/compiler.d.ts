import { GeneratorOptions } from "./generator";
import { TransformerOptions } from "./transformer";

type CompilerOptions = {
    generatorOptions?: GeneratorOptions;
    transformerOptions?: TransformerOptions;
}