import {Relation} from "./relation";
import {Trace} from "../../../../components/src/lib/models/log/model/trace";
import * as _ from "lodash";

/**
 * This class represents the footprint matrix of the log.
 */
export class Footprint {
    public footprint: Relation[][] = [];
    public eventsToMatrix: Map<string, number> = new Map<string, number>();

    /**
     * Creates new instance of Footprint with filled matrix
     * @param allEvents - set of all events
     * @param eventLog - log of events
     * @param loopsL2 - boolean value indicating whether loops of length 2 should be taken into account
     */
    constructor(private allEvents: Set<string>, private eventLog: Array<Trace>, private loopsL2: boolean) {
        let idx = 0;

        // assign index to each event
        for (const event of allEvents) {
            this.eventsToMatrix.set(event, idx++);
        }

        // fill footprint matrix with NOT_CONNECTED signs
        const numberOfEvents = allEvents.size;
        this.footprint = new Array(numberOfEvents).fill(Relation.NOT_CONNECTED).map(() => new Array(numberOfEvents).fill(Relation.NOT_CONNECTED));

        for (const trace of eventLog) {
            for (let i = 0; i < trace.length() - 1; i++) {
                let currentEventNum: number | undefined = this.eventsToMatrix.get(trace.get(i));
                let nextEventNum: number | undefined = this.eventsToMatrix.get(trace.get(i + 1));

                if (currentEventNum !== undefined && nextEventNum !== undefined) {
                    if (this.footprint[currentEventNum][nextEventNum] == Relation.NOT_CONNECTED) {
                        // first occurrence
                        this.footprint[currentEventNum][nextEventNum] = Relation.PRECEDES;
                        this.footprint[nextEventNum][currentEventNum] = Relation.FOLLOWS;
                    } else if (this.footprint[currentEventNum][nextEventNum] == Relation.FOLLOWS) {
                        // second occurrence && FOLLOWS relation present
                        this.footprint[currentEventNum][nextEventNum] = Relation.PARALLEL;
                        this.footprint[nextEventNum][currentEventNum] = Relation.PARALLEL;
                    }
                }

                // other relation types not changed
            }
        }

        // check for loops of length two
        if (loopsL2) {
            this.checkForLoopsOfLengthTwo(eventLog);
        }
    }

    private checkForLoopsOfLengthTwo(eventLog: Array<Trace>): void {
        for (const trace of eventLog) {
            let eventsInTrace: Array<string> = trace.eventNames;
            for (let i = 0; i < eventsInTrace.length - 2; i++) {
                if (_.isEqual(eventsInTrace[i], eventsInTrace[i + 2])) {
                    let currentEvent: number | undefined = this.eventsToMatrix.get(eventsInTrace[i]);
                    let nextEvent: number | undefined = this.eventsToMatrix.get(eventsInTrace[i + 1]);

                    if (currentEvent !== undefined && nextEvent !== undefined) {
                        this.footprint[currentEvent][nextEvent] = Relation.PRECEDES;
                        this.footprint[nextEvent][currentEvent] = Relation.PRECEDES;
                    }
                }
            }
        }
    }

    /**
     * Method used to get relation between two events.
     * @param firstEvent - first event
     * @param secondEvent - second event
     * @returns relation between two events
     */
    public getRelation(firstEvent: string, secondEvent: string): Relation | undefined {
        let rowIdx: number | undefined = this.eventsToMatrix.get(firstEvent);
        let colIdx: number | undefined = this.eventsToMatrix.get(secondEvent);

        if (rowIdx !== undefined && colIdx !== undefined) {
            return this.footprint[rowIdx][colIdx];
        }

        return undefined;
    }

    /**
     * Method used to get all events that precede the given event.
     * @param firstEvent - first event
     * @param secondEvent - second event
     * @returns boolean value indicating whether the first event precedes the second event
     */
    public isFollowed(firstEvent: string, secondEvent: string): boolean {
        return this.getRelation(firstEvent, secondEvent) == Relation.PRECEDES;
    }

    /**
     * Method used to check if two events are connected.
     * @param firstEvent - first event
     * @param secondEvent - second event
     * @returns boolean value indicating whether the first event is not connected to the second event
     */
    public areConnected(firstEvent: string, secondEvent: string): boolean {
        return this.getRelation(firstEvent, secondEvent) != Relation.NOT_CONNECTED;
    }

    /**
     * This method is used to check whether the input and output events of a module are connected between each other.
     * @param inputEvents - set of input events
     * @param outputEvents - set of output events
     * @returns true if all input events precede all output events. Otherwise, returns false.
     */
    public areEventsConnected(inputEvents: Set<string>, outputEvents: Set<string>): boolean {
        const inputEventsArray: string[] = Array.from(inputEvents);
        const outputEventsArray: string[] = Array.from(outputEvents);

        // for every input1, input2 => input1#input2
        let inputTest: boolean = inputEventsArray.some(inputEvent1 =>
            inputEventsArray.some(inputEvent2 => this.areConnected(inputEvent1, inputEvent2)));

        if (inputTest) {
            return false;
        }

        // for every output1, output2 => output1#output2
        let outputTest: boolean = outputEventsArray.some(outputEvent1 =>
            outputEventsArray.some(outputEvent2 => this.areConnected(outputEvent1, outputEvent2)));

        if (outputTest) {
            return false;
        }

        return inputEventsArray.every(inputEvent =>
            outputEventsArray.every(outputEvent => this.isFollowed(inputEvent, outputEvent)));
    }
}
