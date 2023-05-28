export interface StringSequence {
    get(i: number): string;
    length(): number;
}
export interface EditableStringSequence extends StringSequence {
    set(i: number, value: string): void;
}
export interface EditableString {
    setString(value: string): void;
    getString(): string;
}
export declare class EditableStringSequenceWrapper implements EditableStringSequence {
    private readonly _array;
    constructor(array: Array<EditableString>);
    get(i: number): string;
    length(): number;
    set(i: number, value: string): void;
}
