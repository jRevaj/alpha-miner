import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {cleanLog} from "../../../../components/src/lib/algorithms/log/clean-log";
import {Trace} from "../../../../components/src/lib/models/log/model/trace";
import {Footprint} from "../models/footprint";
import {LoopLengthOne} from "../models/loop-length-one";

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
        let loopsL1: Set<LoopLengthOne> = new Set();
        for (const trace of log) {
            this.processLoopsL1(trace, loopsL1);
        }
        console.log("loops of length one: ", loopsL1);

        let eventList: Set<string> = new Set();
        let startingEvents: Set<string> = new Set();
        let endingEvents: Set<string> = new Set();

        // find list of all events & starting events & ending events
        this.extractEvents(log, eventList, startingEvents, endingEvents);
        console.log("eventList: ", eventList);
        console.log("startingEvents: ", startingEvents);
        console.log("endingEvents: ", endingEvents);

        // generate matrix of relations from log
        const footprint: Footprint = new Footprint(eventList, log, false);
        console.log("footprint matrix: ", footprint.footprint);

        // TODO: generate XL - places
        // TODO: generate YL

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

    private checkL1(eventsInTrace: Array<string>) {
        for (let i = 0; i < eventsInTrace.length - 1; i++) {
            if (_.isEqual(eventsInTrace[i], eventsInTrace[i+1])) {
                return i;
            }
        }

        return -1;
    }

    private processLoopsL1(trace: Trace, loopsL1: Set<LoopLengthOne>) {
        // TODO: test
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

            loopsL1.add(loop);
        }
    }
}
