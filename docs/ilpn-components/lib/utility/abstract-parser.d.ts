export declare abstract class AbstractParser<T> {
    static readonly TYPE_BLOCK = ".type";
    protected readonly _allowedTypes: Array<string>;
    protected constructor(allowedTypes: Array<string> | string);
    parse(text: string): T | undefined;
    protected abstract processFileLines(lines: Array<string>): T | undefined;
}
