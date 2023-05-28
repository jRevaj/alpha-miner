import { Transition } from '../../pn/model/transition';
export declare class Event {
    private readonly _id;
    private readonly _label;
    private readonly _nextEvents;
    private readonly _previousEvents;
    private _transition;
    private _localMarking;
    constructor(id: string, label?: string);
    get id(): string;
    get label(): string | undefined;
    get nextEvents(): Set<Event>;
    get previousEvents(): Set<Event>;
    get transition(): Transition | undefined;
    set transition(value: Transition | undefined);
    get localMarking(): Array<number> | undefined;
    addNextEvent(event: Event): void;
    protected addPreviousEvent(event: Event): void;
    initializeLocalMarking(size: number): void;
}
