import { AbstractParser } from './abstract-parser';
export declare abstract class AbstractBlockParser<T> extends AbstractParser<T> {
    protected readonly _supportedBlocks: Array<string>;
    protected constructor(allowedTypes: Array<string> | string, supportedBlocks: Array<string>);
    protected processFileLines(lines: Array<string>): T | undefined;
    protected abstract newResult(): T;
    protected abstract resolveBlockParser(block: string): undefined | ((lines: Array<string>, result: T) => void);
    protected parseEachLine(lines: Array<string>, partParser: (parts: Array<string>, line: string) => void): void;
    protected getLineTrimEnd(lines: Array<string>, index: number): string;
    private parseBlock;
}
