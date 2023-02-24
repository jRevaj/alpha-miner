import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {cleanLog} from "../../../../components/src/lib/algorithms/log/clean-log";
import {Trace} from "../../../../components/src/lib/models/log/model/trace";
import {Footprint} from "../models/footprint";
import {LoopLengthOne} from "../models/loop-length-one";
import {Place} from "../../../../components/src/lib/models/pn/model/place";
import {containsAll, setOfAllSubsets} from "../models/utility";

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
        const footprint: Footprint = new Footprint(eventList, log, true);
        console.log("footprint matrix: ", footprint.footprint);

        // generate xl set
        let xl: Set<Place> = this.generatePlacesFromFootprint(footprint, eventList);

        // generate yl set by reducing xl set
        let yl: Array<string> = this.reduceXl(xl);
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

            loopsL1.add(loop);
        }
    }

    private generatePlacesFromFootprint(footprint: Footprint, eventList: Set<string>): Set<Place> {
        let xl: Set<any> = new Set();
        let pSet: Set<any> = setOfAllSubsets(eventList);
        console.log("size of pSet: ", pSet.size);

        // filter out subsets with empty value
        pSet.forEach((e: any) => {
            if (e.size == 0) {
                pSet.delete(e);
            }
        });

        // convert to arr
        let pSetArr: Array<any> = _.toArray(pSet);

        for (let i = 0; i < pSetArr.length; i++) {
            let first: Set<string> = pSetArr[i];
            for (let j = 0; j < pSetArr.length; j++) {
                if (i == j) {
                    continue;
                }

                let second: Set<string> = pSetArr[j];
                if (footprint.areEventsConnected(first, second)) {
                    let toAdd: Set<string>[] = [first, second];
                    xl.add(toAdd)
                }
            }
        }
        console.log("size of xl: ", xl.size);
        return xl;
    }

    private reduceXl(xl: Set<Place>): Array<string> {
        let toRemove: Set<any> = new Set();
        let potential: Array<any> = _.toArray(xl);

        for (let i = 0; i < potential.length - 1; i++) {
            let iPotential: Set<string>[] = potential[i];
            let iInEvents: any = _.toArray(iPotential[0]);
            let iOutEvents: any = _.toArray(iPotential[1]);

            for (let j = i + 1; j < potential.length; j++) {
                let jPotential: Set<string>[] = potential[j];
                let jInEvents: any = _.toArray(jPotential[0]);
                let jOutEvents: any = _.toArray(jPotential[1]);
                if (containsAll(iInEvents, jInEvents)) {
                    if (containsAll(iOutEvents, jOutEvents)) {
                        toRemove.add(jPotential);
                        continue;
                    }
                }

                if (containsAll(jInEvents, iInEvents)) {
                    if (containsAll(jOutEvents, iOutEvents)) {
                        toRemove.add(iPotential);
                    }
                }
            }
        }

        let toRemoveArr: Array<any> = _.toArray(toRemove);
        let yl: Array<any> = _.difference(potential, toRemoveArr);
        console.log("yl set: ", yl);
        return yl;
    }
}
