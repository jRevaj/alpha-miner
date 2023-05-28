import { LogEvent } from './logEvent';
import { EditableStringSequence } from '../../../utility/string-sequence';
export declare class Trace implements EditableStringSequence {
    events: Array<LogEvent>;
    name?: string;
    description?: string;
    constructor();
    get eventNames(): Array<string>;
    appendEvent(event: LogEvent): void;
    get(i: number): string;
    set(i: number, value: string): void;
    length(): number;
    clone(): Trace;
}
