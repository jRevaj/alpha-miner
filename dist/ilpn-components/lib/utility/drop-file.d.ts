export declare class DropFile {
    readonly content: string;
    private _name;
    private _suffix;
    constructor(name: string, content: string, suffix?: string);
    get name(): string;
    set name(name: string);
    get suffix(): string;
    set suffix(value: string);
    private extractSuffix;
}
