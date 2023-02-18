import {Relation} from "./relation";
import {Trace} from "../../../../components/src/lib/models/log/model/trace";
import * as _ from "lodash";

export class Footprint {
    public footprint: Relation[][] = [];
    public eventsToMatrix: Map<string, number> = new Map<string, number>();

    constructor(private allEvents: Set<string>, private eventLog: Array<Trace>, private loopsL2: boolean) {
        this.Footprint(allEvents, eventLog, loopsL2);
    }

    public Footprint(allEvents: Set<string>, eventLog: Array<Trace>, loopsL2: boolean) {
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
                let nextEventNum: number | undefined = this.eventsToMatrix.get(trace.get(i+1));

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
            for (const trace of eventLog) {
                let eventsInTrace: Array<string> = trace.eventNames;
                for (let i = 0; i < eventsInTrace.length - 2; i++) {
                    if (_.isEqual(eventsInTrace[i], eventsInTrace[i+2])) {
                        let currentEvent: number | undefined = this.eventsToMatrix.get(eventsInTrace[i]);
                        let nextEvent: number | undefined = this.eventsToMatrix.get(eventsInTrace[i+1]);

                        if (currentEvent !== undefined && nextEvent !== undefined) {
                            this.footprint[currentEvent][nextEvent] = Relation.PRECEDES;
                            this.footprint[nextEvent][currentEvent] = Relation.PRECEDES;
                        }
                    }
                }
            }
        }
    }

    public getRelation(firstEvent: string, secondEvent: string): Relation | undefined {
        let rowIdx: number | undefined = this.eventsToMatrix.get(firstEvent);
        let colIdx: number | undefined = this.eventsToMatrix.get(secondEvent);

        if (rowIdx !== undefined && colIdx !== undefined) {
            return this.footprint[rowIdx][colIdx];
        }

        return undefined;
    }

    public isFollowed(firstEvent: string, secondEvent: string): boolean {
        return this.getRelation(firstEvent, secondEvent) == Relation.PRECEDES;
    }

    public areConnected(firstEvent: string, secondEvent: string): boolean {
        return this.getRelation(firstEvent, secondEvent) != Relation.NOT_CONNECTED;
    }

    public areEventsConnected(inputEvents: Set<string>, outputEvents: Set<string>): boolean {
        // for every input1, input2 => input1#input2
        let inputTest: boolean = false;
        for (const first of inputEvents) {
            for (const second of inputEvents) {
                inputTest = this.areConnected(first, second);
                if (inputTest) {
                    return false;
                }
            }
        }

        // for every output1, output2 => output1#output2
        let outputTest: boolean = false;
        for (const first of outputEvents) {
            for (const second of outputEvents) {
                outputTest = this.areConnected(first, second);
                if (outputTest) {
                    return false;
                }
            }
        }

        // for every input in inputEvents && output in outputEvents => input>output
        let ioTest: boolean = false;
        for (const input of inputEvents) {
            for (const output of outputEvents) {
                ioTest = this.isFollowed(input, output);
                if (!ioTest) {
                    break;
                }
            }
        }

        return ioTest;
    }
}
