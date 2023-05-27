import * as _ from "lodash";
import {Trace} from "../../../../components/src/lib/models/log/model/trace";
import {LoopLengthOne} from "./loop-length-one";

/**
 * AlphaPlus class - class that implements the Alpha+ algorithm parts.
 */
export class AlphaPlus {
    public discoveredLoopsL1: Set<LoopLengthOne> = new Set<LoopLengthOne>();

    constructor() {

    }

    /**
     * Main method that processes loops of length 1.
     * @param log - event log
     */
    public preProcessLoopsL1(log: Array<Trace>): void {
        for (const trace of log) {
            this.processLoopsL1(trace);
        }
        console.debug("loops of length one: ", this.discoveredLoopsL1);
    }

    /**
     * Method that adds loops of length 1 to the yl set.
     * @param yl - yl set
     * @param eventList - list of all events
     */
    public postProcessLoopsL1(yl: Array<Set<string>[]>, eventList: Set<string>): void {
        // TODO: finish loops processing

    }

    /**
     * Method that checks whether there is a loop of length 1 in the trace.
     * @param eventsInTrace - list of events in the trace
     */
    private checkL1(eventsInTrace: Array<string>) {
        for (let i = 0; i < eventsInTrace.length - 1; i++) {
            if (_.isEqual(eventsInTrace[i], eventsInTrace[i + 1])) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Method that processes loops of length 1 in the trace and adds them to the discoveredLoopsL1 set.
     * @param trace - trace to be processed
     */
    private processLoopsL1(trace: Trace): void {
        // TODO: test method if working correctly
        let start;
        let eventsInTrace: Array<string> = trace.eventNames;
        while ((start = this.checkL1(eventsInTrace)) != -1) {
            let prev: number = start - 1;
            let currentEvent: number = start;
            while (currentEvent < eventsInTrace.length - 1 && _.isEqual(eventsInTrace[currentEvent], eventsInTrace[currentEvent + 1])) {
                currentEvent++;
            }

            currentEvent++;
            let loop: LoopLengthOne = new LoopLengthOne(eventsInTrace[prev], eventsInTrace[start], eventsInTrace[currentEvent]);
            let numOfLoopedEvents: number = currentEvent - start;
            for (let i = 0; i < numOfLoopedEvents; i++) {
                eventsInTrace.splice(start, 1);
            }

            this.discoveredLoopsL1.add(loop);
        }
    }
}
