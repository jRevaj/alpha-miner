import { Event } from './event';
export declare class PartialOrder {
    private readonly _events;
    private readonly _initialEvents;
    private readonly _finalEvents;
    constructor();
    get initialEvents(): Set<Event>;
    get finalEvents(): Set<Event>;
    get events(): Array<Event>;
    getEvent(id: string): Event | undefined;
    addEvent(event: Event): void;
    determineInitialAndFinalEvents(): void;
    clone(): PartialOrder;
}
