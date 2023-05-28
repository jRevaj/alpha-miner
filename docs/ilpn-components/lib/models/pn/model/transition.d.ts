import { Node } from './node';
import { EditableString } from '../../../utility/string-sequence';
export declare class Transition extends Node implements EditableString {
    private _label;
    private _foldedPair?;
    constructor(label?: string, x?: number, y?: number, id?: string);
    get label(): string | undefined;
    get isSilent(): boolean;
    set label(value: string | undefined);
    get foldedPair(): Transition | undefined;
    set foldedPair(value: Transition | undefined);
    getString(): string;
    setString(value: string): void;
}
