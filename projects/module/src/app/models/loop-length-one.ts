/**
 * LoopLengthOne class
 */
export class LoopLengthOne {
    public prevEvent: string | undefined;
    public loopedEvent: string | undefined;
    public nextEvent: string | undefined;

    /**
     * Creates a new LoopLengthOne object.
     * @param prevEvent - previous event
     * @param loopedEvent - looped event
     * @param nextEvent - next event
     */
    constructor(prevEvent: string, loopedEvent: string, nextEvent: string) {
        this.prevEvent = prevEvent;
        this.loopedEvent = loopedEvent;
        this.nextEvent = nextEvent;
    }
}
