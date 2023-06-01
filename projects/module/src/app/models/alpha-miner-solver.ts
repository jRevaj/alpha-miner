import * as _ from 'lodash';
import {Trace} from "../../../../components/src/lib/models/log/model/trace";
import {Footprint} from "./footprint";
import {Place} from "../../../../components/src/lib/models/pn/model/place";
import {containsAll, customToString, setOfAllSubsets, sortYl} from "./utility";
import {PetriNet} from "../../../../components/src/lib/models/pn/model/petri-net";
import {Transition} from "../../../../components/src/lib/models/pn/model/transition";
import {AlphaPlus} from "./alpha-plus";

/**
 * Class implementing Alpha Miner algorithm
 */
export class AlphaMinerSolver {
    public runtimeLogs: string[] = [];

    private readonly processLoopsL1: boolean;
    private readonly processLoopsL2: boolean;
    private readonly alphaPlus: AlphaPlus | undefined;
    private startingEvents: Set<string> = new Set<string>();
    private endingEvents: Set<string> = new Set<string>();

    /**
     * Creates new instance of AlphaMinerSolver
     * @param loopsL1 - flag indicating whether loops of length 1 should be discovered
     * @param loopsL2 - flag indicating whether loops of length 2 should be discovered
     */
    constructor(loopsL1: boolean, loopsL2: boolean) {
        this.processLoopsL1 = loopsL1;
        this.processLoopsL2 = loopsL2;

        if (this.processLoopsL1) {
            this.alphaPlus = new AlphaPlus();
        }
    }

    /**
     * Method containing main logic of alpha algorithm
     * @param log - cleaned event log
     * @returns discovered Petri net
     */
    public discoverWFNet(log: Array<Trace>): PetriNet {
        // if loops of length 1 should be discovered, pre-process log
        if (this.processLoopsL1 && this.alphaPlus !== undefined) {
            this.alphaPlus.preProcessLoopsL1(log);
        }

        let eventList: Set<string> = new Set();
        this.startingEvents = new Set<string>();
        this.endingEvents = new Set<string>();

        // find list of all events & starting events & ending events
        this.extractEvents(log, eventList, this.startingEvents, this.endingEvents);
        this.runtimeLogs.push("All events (T_L): " + Array.from(eventList).join(", "));
        this.runtimeLogs.push("Starting events (T_I): " + Array.from(this.startingEvents).join(", "));
        this.runtimeLogs.push("Ending events (T_O): " + Array.from(this.endingEvents).join(", ") + "\n");
        console.debug("eventList: ", eventList);
        console.debug("startingEvents: ", this.startingEvents);
        console.debug("endingEvents: ", this.endingEvents);

        // generate matrix of relations from log
        const footprint: Footprint = new Footprint(eventList, log, this.processLoopsL2);
        this.runtimeLogs.push("Footprint matrix: \n" + footprint.footprint.map(row => row.join(", ")).join("\n") + "\n");
        console.debug("footprint matrix: ", footprint.footprint);

        // generate xl set
        let xl: Set<Set<string>[]> = this.generatePlacesFromFootprint(footprint, eventList);
        this.runtimeLogs.push("X_L set: \n" + customToString(xl) + "\n");
        console.debug("xl:", xl);

        // generate yl set by reducing xl set
        let yl: Array<Set<string>[]> = this.reduceXl(xl);
        this.runtimeLogs.push("Y_L set: \n" + customToString(yl) + "\n");
        console.debug("yl:", yl);

        // if loops of length 1 should be discovered, post-process yl set
        if (this.processLoopsL1 && this.alphaPlus !== undefined) {
            this.alphaPlus.postProcessLoopsL1(yl, eventList);
        }

        return this.constructPetriNet(eventList, yl);
    }

    /**
     * First three steps of alpha algorithm. Method fills allEvents, startingEvents and endingEvents sets.
     * @param eventLog - event log
     * @param allEvents - set of all events
     * @param startingEvents - set of starting events
     * @param endingEvents - set of ending events
     */
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

    /**
     * Generates xl set from footprint matrix
     * @param footprint - footprint matrix
     * @param eventList - list of all events
     * @returns xl set
     */
    private generatePlacesFromFootprint(footprint: Footprint, eventList: Set<string>): Set<Set<string>[]> {
        let xl: Set<Set<string>[]> = new Set();
        let pSet: Set<Set<string>> = setOfAllSubsets(eventList);
        this.runtimeLogs.push("Size of power set: " + pSet.size);
        console.debug("size of pSet: ", pSet.size);

        // filter out subsets with empty value
        let pSetArr: Set<string>[] = Array.from(pSet);
        pSetArr = pSetArr.filter(e => e.size !== 0);

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

        this.runtimeLogs.push("Size of X_L set: " + xl.size);
        console.debug("size of xl: ", xl.size);
        return xl;
    }

    /**
     * Generates yl set from xl set
     * @param xl - xl set
     * @returns yl set
     */
    private reduceXl(xl: Set<Set<string>[]>): Array<Set<string>[]> {
        let toRemove: Set<Set<string>[]> = new Set();
        let potential: Array<Set<string>[]> = Array.from(xl);

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

        let toRemoveArr: Array<Set<string>[]> = Array.from(toRemove);
        return _.difference(potential, toRemoveArr);
    }

    /**
     * Constructs Petri net from event list and yl set
     * @param eventList - list of all events
     * @param yl - yl set
     * @returns Petri net
     */
    private constructPetriNet(eventList: Set<string>, yl: Array<Set<string>[]>): PetriNet {
        const net: PetriNet = new PetriNet();

        eventList.forEach(event => {
            const t: Transition = new Transition(event, event);
            net.addTransition(t);
        })

        yl = sortYl(yl);

        // add places and arcs
        yl.forEach((mapping, index) => {
            const p: Place = new Place(0, "p" + (index + 1));
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

        // add start and end places
        for (const t of net.getTransitions()) {
            if (t.ingoingArcs.length === 0 && this.startingEvents.has(t.getString())) {
                const p = new Place(1, "in");
                net.addPlace(p);
                net.addArc(p, t);
            }
            if (t.outgoingArcs.length === 0 && this.endingEvents.has(t.getString())) {
                const p = new Place(0, "out");
                net.addPlace(p);
                net.addArc(t, p);
            }
        }

        console.debug("solution pn: ", net);
        return net;
    }
}
