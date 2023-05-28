import { DropFile } from './drop-file';
export declare class AlgorithmResult {
    static readonly RESULT_TYPE = "result";
    static readonly RUNTIME_BLOCK = ".runtime";
    static readonly OUTPUT_BLOCK = ".output";
    private readonly _algorithmName;
    private readonly _runtimeMs;
    private readonly _output;
    constructor(algorithmName: string, startTimeMs?: number, endTimeMs?: number);
    addOutputLine(outputLine: string): void;
    serialise(): string;
    toDropFile(fileName: string, suffix?: string): DropFile;
}
