import {Injectable} from '@angular/core';
import {cleanLog} from "../../../../components/src/lib/algorithms/log/clean-log";
import {Trace} from "../../../../components/src/lib/models/log/model/trace";

@Injectable({
    providedIn: 'root'
})
export class AlphaMinerService {
    public loopsL2: boolean = true;

    constructor() {
    }

    public mine(log: Array<Trace>) {
        const cleanedLog = cleanLog(log);
        this.discoverWFNet(cleanedLog);
    }

    private discoverWFNet(log: Array<Trace>) {
        // TODO: preprocess loops

        let eventList: Set<string> = new Set();
        let startingEvents: Set<string> = new Set();
        let endingEvents: Set<string> = new Set();

        // steps 1,2,3
        this.extractEvents(log, eventList, startingEvents, endingEvents);
        console.log("eventList: ", eventList);
        console.log("startingEvents: ", startingEvents);
        console.log("endingEvents: ", endingEvents);

        // generate places

    }

    private extractEvents(eventLog: Array<Trace>, allEvents: Set<string>, startingEvents: Set<string>, endingEvents: Set<string>): void {
        allEvents.clear();
        startingEvents.clear();
        endingEvents.clear();

        for (let trace of eventLog) {
            startingEvents.add(trace.get(0));
            endingEvents.add(trace.get(trace.length() - 1));
            trace.eventNames.forEach(event => allEvents.add(event));
        }
    }
}
