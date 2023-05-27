import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {Trace} from "../../../../components/src/lib/models/log/model/trace";
import {Footprint} from "./footprint";
import {LoopLengthOne} from "./loop-length-one";
import {Place} from "../../../../components/src/lib/models/pn/model/place";
import {containsAll, setOfAllSubsets} from "./utility";
import {PetriNet} from "../../../../components/src/lib/models/pn/model/petri-net";
import {Transition} from "../../../../components/src/lib/models/pn/model/transition";

@Injectable({
    providedIn: 'root'
})
export class AlphaMinerSolver {
    public loopsL2: boolean = true;
    private startingEvents: Set<string> = new Set<string>();
    private endingEvents: Set<string> = new Set<string>();

    constructor() {
    }

    public discoverWFNet(log: Array<Trace>): PetriNet {
        // let loopsL1: Set<LoopLengthOne> = new Set();
        // for (const trace of log) {
        //     this.processLoopsL1(trace, loopsL1);
        // }
        // console.log("loops of length one: ", loopsL1);

        let eventList: Set<string> = new Set();
        this.startingEvents = new Set<string>();
        this.endingEvents = new Set<string>();


        // find list of all events & starting events & ending events
        this.extractEvents(log, eventList, this.startingEvents, this.endingEvents);
        console.debug("eventList: ", eventList);
        console.debug("startingEvents: ", this.startingEvents);
        console.debug("endingEvents: ", this.endingEvents);

        // generate matrix of relations from log
        const footprint: Footprint = new Footprint(eventList, log, true);
        console.log("footprint matrix: ", footprint.footprint);

        // generate xl set
        let xl: Set<Place> = this.generatePlacesFromFootprint(footprint, eventList);

        // generate yl set by reducing xl set
        let yl: Array<string> = this.reduceXl(xl);

        // TODO: take in account discovered loops of length 1
        // this.postProcessLoopsL1(loopsL1, yl, eventList);

        return this.constructPetriNet(eventList, yl);
    }

    private extractEvents(eventLog: Array<Trace>, allEvents: Set<string>, startingEvents: Set<string>, endingEvents: Set<string>): void {
        allEvents.clear();
        startingEvents.clear();
        endingEvents.clear();

        for (const trace of eventLog) {
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

    private processLoopsL1(trace: Trace, loopsL1: Set<LoopLengthOne>): void {
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

    private postProcessLoopsL1(loopsL1: Set<LoopLengthOne>, yl: Array<string>, eventList: Set<string>): void {
        // TODO: finish loops processing

    }

    private constructPetriNet(eventList: Set<string>, yl: Array<string>): PetriNet {
        // TODO: debug construction (seems to be reversed)
        // TODO: debug duplicate transitions on complex examples
        const net: PetriNet = new PetriNet();

        eventList.forEach(event => {
            const t: Transition = new Transition(event, 0, 0, event);
            net.addTransition(t);
        })

        yl = _.reverse(yl);
        yl.forEach((mapping, index) => {
            const p: Place = new Place(0, 0, 0, "p" + (index + 1));
            net.addPlace(p);
            for (const inEvent of mapping[0]) {
                const t: Transition | undefined = net.getTransition(inEvent);
                if (t) {
                    net.addArc(t, p, 1);
                }
            }
            for (const outEvent of mapping[1]) {
                const t: Transition | undefined = net.getTransition(outEvent);
                if (t) {
                    net.addArc(p, t, 1);
                }
            }
        })

        for (const t of net.getTransitions()) {
            if (t.ingoingArcs.length === 0) {
                const p = new Place(1, 0, 0, "in");
                net.addPlace(p);
                net.addArc(p, t);
            }
            if (t.outgoingArcs.length === 0) {
                const p = new Place(0, 0, 0, "out");
                net.addPlace(p);
                net.addArc(t, p);
            }
        }

        console.log("solution pn: ", net);
        return net;
    }
}
