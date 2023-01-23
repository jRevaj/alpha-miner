import {Relation} from "./relation";
import {Trace} from "../../../../components/src/lib/models/log/model/trace";

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

        // TODO: process loops of length 2
    }

    public getRelation(firstEvent: string, secondEvent: string): Relation | undefined {
        let rowIdx: number | undefined = this.eventsToMatrix.get(firstEvent);
        let colIdx: number | undefined = this.eventsToMatrix.get(secondEvent);

        if (rowIdx !== undefined && colIdx !== undefined) {
            return this.footprint[rowIdx][colIdx];
        }

        return undefined;
    }

}
