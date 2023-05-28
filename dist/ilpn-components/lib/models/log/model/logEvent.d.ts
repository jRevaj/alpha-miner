import { Lifecycle } from './lifecycle';
export declare class LogEvent {
    name: string;
    resource?: string;
    timestamp?: Date;
    lifecycle?: Lifecycle;
    private _attributes;
    private _pair?;
    constructor(name: string);
    getAttribute(name: string): string | undefined;
    setAttribute(name: string, value: string): void;
    setPairEvent(pair: LogEvent): void;
    getPairEvent(): LogEvent | undefined;
}
