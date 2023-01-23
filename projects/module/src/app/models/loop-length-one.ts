export class LoopLengthOne {
    public prevEvent: string | undefined;
    public loopedEvent: string | undefined;
    public nextEvent: string | undefined;

    constructor(prevEvent: string, loopedEvent: string, nextEvent: string) {
        this.prevEvent = prevEvent;
        this.loopedEvent = loopedEvent;
        this.nextEvent = nextEvent;
    }
}
