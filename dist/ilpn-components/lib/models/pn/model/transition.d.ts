import { Node } from './node';
import { EditableString } from '../../../utility/string-sequence';
export declare class Transition extends Node implements EditableString {
    private _label;
    constructor(label?: string, x?: number, y?: number, id?: string);
    get label(): string | undefined;
    get isSilent(): boolean;
    set label(value: string | undefined);
    getString(): string;
    setString(value: string): void;
}
